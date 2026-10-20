import {
  findNodeById,
  getParentIds,
  getTopLevelChildIds
} from "../../components/utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TreeViewBaseItem } from "@mui/x-tree-view";

const setExpandedScreens = vi.fn();

describe("getTopLevelChildIds()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("returns all top level items", () => {
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

    const ids = getTopLevelChildIds(tree);

    expect(ids).toEqual(["screen 1", "screen 2"]);
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

    const ids = getTopLevelChildIds(tree);

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

    const ids = getTopLevelChildIds(tree);
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

    const ids = getTopLevelChildIds(tree);
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

describe("getParentIds()", () => {
  const tree: TreeViewBaseItem[] = [
    {
      id: "folder1",
      label: "Folder 1",
      children: [
        {
          id: "screen1",
          label: "Screen 1"
        },
        {
          id: "subfolder",
          label: "Subfolder",
          children: [
            {
              id: "screen2",
              label: "Screen 2"
            },
            {
              id: "nested folder",
              label: "nested folder",
              children: [
                {
                  id: "screen3",
                  label: "Screen 3"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "screen4",
      label: "Screen 4"
    }
  ];

  it("returns an empty array for a top level item", () => {
    const result = getParentIds(tree, "screen4");
    expect(result).toEqual([]);
  });

  it("returns the direct parent of a child node", () => {
    const result = getParentIds(tree, "screen1");
    expect(result).toEqual(["folder1"]);
  });

  it("returns all parents of a nested node", () => {
    const result = getParentIds(tree, "screen3");
    expect(result).toEqual(["folder1", "subfolder", "nested folder"]);
  });

  it("returns an empty array when the target is a top-level folder", () => {
    const result = getParentIds(tree, "folder1");
    expect(result).toEqual([]);
  });

  it("returns an empty array when the id doesnt exist", () => {
    const result = getParentIds(tree, "fake");
    expect(result).toEqual([]);
  });
});
