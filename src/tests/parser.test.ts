import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  handleDuplicate,
  parseChildren,
  parseScreenTree
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
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
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

describe("parseChildren()", (): void => {
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
    const [children, ids] = await parseChildren(testJson, [], "", {});
    expect(children.length).toEqual(2);
    expect(ids).toHaveProperty("top+middle1+bottom");
  });

  it("adds macros of duplicate screens to correct ID", async (): Promise<void> => {
    const testJson = JSON.parse(`
    {
      "file": "top.bob",
      "children": [
          {
              "file": "middle1.bob",
              "macros": {
                "P": "hello"
              }
          },
          {
              "file": "middle1.bob",
              "duplicate": true,
              "macros": {
                "P": "hi"
              }
          }
      ]
    }`);
    const [children, ids] = await parseChildren(testJson, [], "", {});
    expect(children.length).toEqual(1);
    expect(ids["top+middle1"].macros?.length).toEqual(2);
    expect(ids["top+middle1"].macros).toEqual([{ P: "hello" }, { P: "hi" }]);
  });
});

describe("handleDuplicates()", (): void => {
  it("adds macros of duplicate to existing screen id", (): void => {
    let ids: FileIDs = {
      test: {
        file: "test.bob",
        macros: [{ Q: "something" }]
      }
    };
    ids = handleDuplicate({ P: "hello" }, ids, "test.bob");

    expect(ids["test"].macros?.length).toEqual(2);
  });

  it("does nothing if no macros", (): void => {
    let ids: FileIDs = {
      test: {
        file: "test.bob",
        macros: [{ Q: "something" }]
      }
    };
    ids = handleDuplicate(undefined, ids, "test.bob");

    expect(ids["test"].macros?.length).toEqual(1);
  });
});
