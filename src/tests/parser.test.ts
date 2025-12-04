import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  parseScreenTree,
  RecursiveTreeViewBuilder,
  RecursiveAppendDuplicateFileMacros
} from "../utils/parser";
import { FileIDs } from "../store";

/**
 * The next few lines are mocking global fetch. This is necessary since
 * vitest runs in the "jsdom" browser environment in order to render components
 * but this does not have fetch.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {}
  }
}

interface GlobalFetch extends NodeJS.Global {
  fetch: any;
}
const globalWithFetch = global as GlobalFetch;

beforeEach((): void => {
  // Ensure the fetch() function mock is always cleared.
  vi.spyOn(globalWithFetch, "fetch").mockClear();
});

describe("parseScreenTree()", (): void => {
  it("successfully fetches the file", async (): Promise<void> => {
    const mockSuccessResponse = JSON.parse(`
    {
      "file": "top.bob",
      "children": [
          {
              "file": "middle1.bob",
              "children": [
                  {
                      "file": "bottom.bob"
                  }
              ]
          },
          {
              "file": "middle2.bob"
          }
      ]
    }`);
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: (): Promise<unknown> => mockJsonPromise
    });
    const mockFetch = (): Promise<unknown> => mockFetchPromise;
    vi.spyOn(globalWithFetch, "fetch").mockImplementation(mockFetch);

    const [tree, ids, firstFile] = await parseScreenTree("test-map.json");
    expect(tree.length).toEqual(1);
    expect(firstFile).toEqual("top.bob");
  });
});

describe("RecursiveTreeViewBuilder()", (): void => {
  it("parses child screens correctly", async (): Promise<void> => {
    const testJson = JSON.parse(`
    {
      "file": "top.bob",
      "children": [
          {
              "file": "middle1.bob",
              "children": [
                  {
                      "file": "bottom.bob"
                  }
              ]
          },
          {
              "file": "middle2.bob"
          }
      ]
    }`);

    const { fileMap, treeViewItems } = await RecursiveTreeViewBuilder(
      testJson.children,
      "top"
    );

    const guid = Object.keys(fileMap).find(
      key => fileMap[key].urlId === "top+middle1+bottom"
    );
    const guidMiddle1 = Object.keys(fileMap).find(
      key => fileMap[key].urlId === "top+middle1"
    );
    const guidMiddle2 = Object.keys(fileMap).find(
      key => fileMap[key].urlId === "top+middle2"
    );

    expect(guid).not.toBeUndefined();
    expect(guid).not.toBeNull();
    expect(guidMiddle1).not.toBeUndefined();
    expect(guidMiddle1).not.toBeNull();
    expect(guidMiddle2).not.toBeUndefined();
    expect(guidMiddle2).not.toBeNull();

    expect(fileMap[guid!].file).toEqual("bottom.bob");
    expect(fileMap[guid!].macros?.length).toBe(0);

    expect(fileMap[guidMiddle1!].file).toEqual("middle1.bob");
    expect(fileMap[guidMiddle1!].macros?.length).toBe(0);

    expect(fileMap[guidMiddle2!].file).toEqual("middle2.bob");
    expect(fileMap[guidMiddle2!].macros?.length).toBe(0);

    // 2 middle siblings
    expect(treeViewItems.length).toEqual(2);

    // Check first middle sibling is as expected
    const middle1TreeView = treeViewItems.find(item => item.id === guidMiddle1);
    expect(middle1TreeView?.children?.length).toBe(1);
    expect((middle1TreeView?.children ?? [])[0]?.id).toBe(guid);
    expect(middle1TreeView?.label).toBe("middle1");

    // Check second middle sibling is as expected
    const middle2TreeView = treeViewItems.find(item => item.id === guidMiddle2);
    expect(middle2TreeView?.children?.length).toBe(0);
    expect(middle2TreeView?.label).toBe("middle2");

    // Check bottom treeview is as expected
    const bottomTreeView = (middle1TreeView?.children ?? [null])[0];
    expect(bottomTreeView?.children?.length).toBe(0);
    expect(bottomTreeView?.label).toBe("bottom");
    expect(bottomTreeView?.id).toBe(guid);
  });

  it("adds macros of duplicate screens to correct ID", () => {
    const testJson = {
      file: "top.bob",
      children: [
        {
          file: "middle1.bob",
          macros: {
            P: "hello"
          }
        },
        {
          file: "middle1.bob",
          duplicate: true,
          macros: {
            P: "hi"
          }
        }
      ]
    };

    const { fileMap, treeViewItems } = RecursiveTreeViewBuilder(
      testJson.children,
      "top"
    );
    expect(treeViewItems.length).toEqual(1);
    const guid = Object.keys(fileMap).find(
      key => fileMap[key].urlId === "top+middle1"
    );

    expect(guid).not.toBeUndefined();
    expect(guid).not.toBeNull();
    // At this stage we expect only the non-duplicate macro set to be added
    expect(fileMap[guid!].file).toEqual("middle1.bob");
    expect(fileMap[guid!].macros?.length).toEqual(1);
    expect(fileMap[guid!].macros).toEqual([{ P: "hello" }]);

    const matchingTreeView = treeViewItems.find(item => item.id === guid);
    expect(matchingTreeView?.label).toBe("middle1");
    expect(matchingTreeView?.children?.length).toBe(0);
  });

  it("parses child screens to generate the expected urlId string", async (): Promise<void> => {
    const testJson = {
      file: "top.bob",
      children: [
        {
          file: "middle1.bob",
          children: [
            {
              file: "path1/index.bob"
            },
            {
              file: "path2/index.bob"
            },
            {
              file: "index.bob"
            },
            {
              file: "path1/not_index.bob"
            }
          ]
        },
        {
          file: "path0/index.bob"
        }
      ]
    };

    const { fileMap } = await RecursiveTreeViewBuilder(
      testJson.children,
      "top"
    );

    const expectedUrlIds = [
      "top+middle1",
      "top+path0__index",
      "top+middle1+path1__index",
      "top+middle1+path2__index",
      "top+middle1+index",
      "top+middle1+not_index"
    ];
    const actualUrlIds = Object.values(fileMap).map(x => x.urlId);

    expect(actualUrlIds.sort()).toEqual(expectedUrlIds.sort());
  });
});

describe("RecursiveAppendDuplicateFileMacros()", (): void => {
  it("adds macros of duplicate to existing screen id", (): void => {
    const testJson = {
      file: "top.bob",
      children: [
        {
          file: "middle1.bob",
          macros: {
            P: "hello"
          }
        },
        {
          file: "middle1.bob",
          duplicate: true,
          macros: {
            S: "hi"
          }
        },
        {
          file: "AnotherFile.bob",
          duplicate: true,
          macros: {
            Another: "AnotherFilesMacros"
          }
        }
      ]
    };

    let ids: FileIDs = {
      test: {
        guid: "1123",
        file: "middle1.bob",
        urlId: "top+middle1",
        macros: [{ Q: "something" }]
      }
    };

    RecursiveAppendDuplicateFileMacros(testJson.children, ids);

    const expectedMacroKeys = ["Q", "S"];
    const macroKeys = ids["test"].macros?.flatMap(macroHash =>
      Object.keys(macroHash)
    );

    // Check we have the expected macro keys
    expect(macroKeys?.length).toEqual(expectedMacroKeys.length);
    expect(macroKeys?.sort()).toEqual(expectedMacroKeys.sort());

    // Still contains the initial macro.
    const qMacros = ids["test"].macros?.find(macroHash => "Q" in macroHash);
    expect(qMacros).toEqual({ Q: "something" });

    // Has added the extra macro for the duplicate file.
    const sMacros = ids["test"].macros?.find(macroHash => "S" in macroHash);
    expect(sMacros).toEqual({ S: "hi" });
  });

  it("does nothing if no json undefined", (): void => {
    let ids: FileIDs = {
      test: {
        guid: "1123",
        file: "test.bob",
        urlId: "top+middle1",
        macros: [{ Q: "something" }]
      }
    };

    // @ts-expect-error: undefined is intentional here
    RecursiveAppendDuplicateFileMacros(undefined, ids);

    expect(ids["test"].macros?.length).toEqual(1);
  });

  it("adds macros of duplicate to existing screen id recursively", (): void => {
    const testJson = {
      file: "top.bob",
      children: [
        {
          file: "middle1.bob",
          macros: {
            P: "hello"
          },
          children: [
            {
              file: "Bottom1.bob",
              duplicate: false,
              macros: {
                Q: "something"
              }
            },
            {
              file: "Bottom1.bob",
              duplicate: true,
              macros: {
                Another: "AnotherFilesMacros"
              }
            }
          ]
        }
      ]
    };

    let ids: FileIDs = {
      test: {
        guid: "1123",
        file: "Bottom1.bob",
        urlId: "top+middle1+Bottom1",
        macros: [{ Q: "something" }]
      }
    };

    RecursiveAppendDuplicateFileMacros(testJson.children, ids);

    const expectedMacroKeys = ["Q", "Another"];
    const macroKeys = ids["test"].macros?.flatMap(macroHash =>
      Object.keys(macroHash)
    );

    // Check we have the expected macro keys
    expect(macroKeys?.length).toEqual(expectedMacroKeys.length);
    expect(macroKeys?.sort()).toEqual(expectedMacroKeys.sort());

    // Still contains the initial macro.
    const qMacros = ids["test"].macros?.find(macroHash => "Q" in macroHash);
    expect(qMacros).toEqual({ Q: "something" });

    // Has added the extra macro for the duplicate file.
    const aMacros = ids["test"].macros?.find(
      macroHash => "Another" in macroHash
    );
    expect(aMacros).toEqual({ Another: "AnotherFilesMacros" });
  });
});
