import {
  findNodeById,
  getAllScreensWithChildrenItemIds
} from "../../components/utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TreeViewBaseItem } from "@mui/x-tree-view";

const setExpandedScreens = vi.fn();

describe("getAllScreensWithChildrenItemIds()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("sets an empty array when there are no expandable items", () => {
    const tree: TreeViewBaseItem[] = [
      {
        id: "screen 1",
        label: "Screen 1"
      },
      {
        id: "screen 2",
        label: "Screen 2"
      }
    ];

    const ids = getAllScreensWithChildrenItemIds(tree);

    expect(ids).toEqual([]);
  });

  it("returns top-level folders with children", () => {
    const tree: TreeViewBaseItem[] = [
      {
        id: "folder1",
        label: "Folder 1",
        children: [
          {
            id: "screen1",
            label: "Screen 1"
          }
        ]
      }
    ];

    const ids = getAllScreensWithChildrenItemIds(tree);

    expect(ids).toEqual(["folder1"]);
  });

  it("loops over nested folders", () => {
    const tree: TreeViewBaseItem[] = [
      {
        id: "folder 1",
        label: "Folder 1",
        children: [
          {
            id: "folder 1/subfolder",
            label: "Sub Folder",
            children: [
              {
                id: "folder 1/subfolder/screen",
                label: "Screen"
              }
            ]
          }
        ]
      }
    ];

    const ids = getAllScreensWithChildrenItemIds(tree);
    expect(ids).toContain("folder 1/subfolder");
    expect(ids).toContain("folder 1");
  });

  it("does not include childless nodes", () => {
    const tree: TreeViewBaseItem[] = [
      {
        id: "folder",
        label: "Folder",
        children: [
          {
            id: "screen",
            label: "Screen"
          }
        ]
      }
    ];

    const ids = getAllScreensWithChildrenItemIds(tree);
    expect(ids).not.toContain("screen");
    expect(ids).toContain("folder");
  });
});

describe("findNodeById()", () => {
  const tree: TreeViewBaseItem[] = [
    {
      id: "folder 1",
      label: "Folder 1",
      children: [
        {
          id: "folder 1/screen 1",
          label: "Screen 1"
        },
        {
          id: "folder 1/subfolder",
          label: "Sub Folder",
          children: [
            {
              id: "folder 1/subfolder/screen 2",
              label: "Screen 2"
            }
          ]
        }
      ]
    },
    {
      id: "screen 3",
      label: "Screen 3"
    }
  ];

  it("can find a top-level node", () => {
    const result = findNodeById(tree, "screen 3");
    expect(result).toEqual({
      id: "screen 3",
      label: "Screen 3"
    });
  });

  it("can find a child node", () => {
    const result = findNodeById(tree, "folder 1/screen 1");
    expect(result).toEqual({
      id: "folder 1/screen 1",
      label: "Screen 1"
    });
  });

  it("finds a deeply nested node", () => {
    const result = findNodeById(tree, "folder 1/subfolder/screen 2");
    expect(result).toEqual({
      id: "folder 1/subfolder/screen 2",
      label: "Screen 2"
    });
  });

  it("returns the folder node when searching for a folder", () => {
    const result = findNodeById(tree, "folder 1/subfolder");
    expect(result).toEqual({
      id: "folder 1/subfolder",
      label: "Sub Folder",
      children: [
        {
          id: "folder 1/subfolder/screen 2",
          label: "Screen 2"
        }
      ]
    });
  });

  it("returns undefined when node doesn't exist", () => {
    const result = findNodeById(tree, "not here");
    expect(result).toBeUndefined();
  });

  it("returns undefined for an empty tree", () => {
    const result = findNodeById([], "empty");
    expect(result).toBeUndefined();
  });
});
