import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  parseScreenTree,
  RecursiveTreeViewBuilder,
  RecursiveAppendDuplicateFileMacros,
  selectFileMetadataByFilePathAndMacros
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const [tree, , firstFile] = await parseScreenTree("test-map.json");
    expect(tree.length).toEqual(1);
    expect(firstFile).toEqual("top.bob");
  });

  it("successfully fetches the file with a display name", async (): Promise<void> => {
    const mockSuccessResponse = JSON.parse(`
    {
      "file": "top.bob",
      "displayName": "Top Synoptic",
      "children": [
          {
              "file": "middle1.bob",
              "displayName": "Middle File 1",
              "children": [
                  {
                      "file": "bottom.bob",
                      "displayName": "Bottom File"
                  }
              ]
          },
          {
              "file": "middle2.bob",
              "displayName": "Middle File 2"
          }
      ]
    }`);
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: (): Promise<unknown> => mockJsonPromise
    });
    const mockFetch = (): Promise<unknown> => mockFetchPromise;
    vi.spyOn(globalWithFetch, "fetch").mockImplementation(mockFetch);

    const [tree, , firstFile] = await parseScreenTree("test-map.json");
    expect(tree.length).toEqual(1);
    expect(firstFile).toEqual("top.bob");
    expect(tree[0].label).toEqual("Top Synoptic");
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

  it("parses child screens to generate the expected urlId strings with display names", async (): Promise<void> => {
    const testJson = {
      file: "top.bob",
      displayName: "Top Screen",
      children: [
        {
          file: "middle1.bob",
          displayName: "Middle Screen",
          children: [
            {
              file: "path1/index.bob",
              displayName: "Index 1"
            },
            {
              file: "path2/index.bob",
              displayName: "Index 2"
            },
            {
              file: "index.bob",
              displayName: "Index 3"
            },
            {
              file: "path1/not_index.bob",
              displayName: "Not Index"
            }
          ]
        },
        {
          file: "path0/index.bob",
          displayName: "Index"
        }
      ]
    };

    const { fileMap } = await RecursiveTreeViewBuilder(
      testJson.children,
      "Top Screen"
    );

    const expectedUrlIds = [
      "Top Screen+Index",
      "Top Screen+Middle Screen",
      "Top Screen+Middle Screen+Index 1",
      "Top Screen+Middle Screen+Index 2",
      "Top Screen+Middle Screen+Index 3",
      "Top Screen+Middle Screen+Not Index"
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

    const ids: FileIDs = {
      test: {
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
    const ids: FileIDs = {
      test: {
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

    const ids: FileIDs = {
      test: {
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

describe("selectFileMetadataByFilePathAndMacros", () => {
  // Sample test data
  const sampleFileMetadata: FileIDs = {
    file1: {
      urlId: "id1",
      file: "/path/to/file1.txt",
      macros: [{ KEY1: "value1", KEY2: "value2" }]
    },
    file2: {
      urlId: "id2",
      file: "/path/to/file2.txt",
      macros: [{ KEY3: "value3" }]
    },
    file3: {
      urlId: "id3",
      file: "/path/to/file3.txt",
      macros: []
    },
    file4: {
      urlId: "id4",
      file: "/path/to/file4.txt"
    },
    file5: {
      urlId: "id5",
      file: "/path/to/file1.txt",
      macros: [{ KEY1: "different", KEY2: "value2" }]
    },
    file6: {
      urlId: "id6",
      file: "/path/to/file1.txt",
      macros: [{ KEY1: "value1", KEY2: "value2", EXTRA: "extra" }]
    },
    file7: {
      urlId: "id7",
      file: "/path/to/file7.txt",
      macros: [{ KEY1: "value1", KEY2: "value3" }, { OTHER: "set" }]
    }
  };

  it("should find file with exact matching macros", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1", KEY2: "value2" }
    );

    expect(result).toBeDefined();
    expect(result?.file).toBe("/path/to/file1.txt");
    expect(result?.urlId).toBe("id1");
    expect(result?.macros?.[0]).toEqual({ KEY1: "value1", KEY2: "value2" });
  });

  it("should filter out LCID and DID macros when matching", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1", KEY2: "value2", LCID: "1033", DID: "123" }
    );

    expect(result).toBeDefined();
    expect(result?.file).toBe("/path/to/file1.txt");
    expect(result?.urlId).toBe("id1");
    expect(result?.macros?.[0]).toEqual({ KEY1: "value1", KEY2: "value2" });
  });

  it("should find file with no macros when target macros are empty", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file3.txt",
      {}
    );

    expect(result).toBeDefined();
    expect(result?.file).toBe("/path/to/file3.txt");
    expect(result?.urlId).toBe("id3");
    expect(result?.macros).toEqual([]);
  });

  it("should find file with undefined macros when target macros are empty", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file4.txt",
      {}
    );

    expect(result).toBeDefined();
    expect(result?.file).toBe("/path/to/file4.txt");
    expect(result?.urlId).toBe("id4");
    expect(result?.macros).toBeUndefined();
  });

  it("should find file with undefined macros when target macros are undefined", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file4.txt"
    );

    expect(result).toBeDefined();
    expect(result?.urlId).toBe("id4");
    expect(result?.file).toBe("/path/to/file4.txt");
  });

  it("should not find file when macros do not match", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "wrong", KEY2: "value2" }
    );

    expect(result).toBeUndefined();
  });

  it("should not find file when macros have different keys", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1", DIFFERENT: "value2" }
    );

    expect(result).toBeUndefined();
  });

  it("should not find file when target has fewer macros than file", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1" }
    );

    expect(result).toBeUndefined();
  });

  it("should not find file when target has more macros than file", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1", KEY2: "value2", EXTRA: "value3" }
    );

    expect(result).toBeUndefined();
  });

  it("should not find file when file path does not exist", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/nonexistent.txt",
      { KEY1: "value1", KEY2: "value2" }
    );

    expect(result).toBeUndefined();
  });

  it("should handle empty file metadata", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      {},
      "/path/to/file1.txt",
      { KEY1: "value1", KEY2: "value2" }
    );

    expect(result).toBeUndefined();
  });

  it("should find file with matching macros when multiple files have the same path", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file1.txt",
      { KEY1: "value1", KEY2: "value2" }
    );

    expect(result).toBeDefined();
    expect(result?.file).toBe("/path/to/file1.txt");
    expect(result?.urlId).toBe("id1");
    expect(result?.macros?.[0]).toEqual({ KEY1: "value1", KEY2: "value2" });
  });

  it("should find file with multiple macro sets if one set matches", () => {
    const result = selectFileMetadataByFilePathAndMacros(
      sampleFileMetadata,
      "/path/to/file7.txt",
      { KEY1: "value1", KEY2: "value3" }
    );

    expect(result).toBeDefined();
    expect(result?.urlId).toBe("id7");
    expect(result?.file).toBe("/path/to/file7.txt");
  });
});
