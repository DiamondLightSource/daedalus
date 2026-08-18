import { describe, beforeEach, it, expect, vi } from "vitest";
import { useQuickScreens, getQuickScreens } from "../../hooks/useQuickScreens";
import { act, render, waitFor } from "@testing-library/react";

const mockUseLocation = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation()
}));

vi.mock("@diamondlightsource/cs-web-lib", () => ({
  useNotification: () => ({
    showWarning: vi.fn(),
    showError: vi.fn()
  })
}));

const onCompleted = vi.fn();

function testRenderer({
  displayInstance,
  addDisplayInstanceByDescription,
  onCompleted
}: {
  displayInstance?: any;
  addDisplayInstanceByDescription: (
    file: string,
    macros: any,
    description: any
  ) => void;
  onCompleted: () => void;
}) {
  let result: any;

  function TestComponent() {
    result = useQuickScreens({
      displayInstance,
      addDisplayInstanceByDescription,
      onCompleted
    });

    return <div />;
  }

  render(<TestComponent />);

  return {
    getResult: () => result
  };
}

describe("useQuickScreens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          bobQuickScreen: "test"
        }
      }
    });
  });

  it("loads Quick Screens", async () => {
    localStorage.setItem(
      "quickScreens/screen 1",
      "{type: 'displayGridLayout', children: []}"
    );
    const { getResult } = testRenderer({
      displayInstance: {
        macros: {},
        description: { type: "displayGridLayout", children: [] }
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    await waitFor(() => {
      expect(getResult().tree).toEqual([
        {
          id: "screen 1",
          label: "screen 1"
        }
      ]);
    });
  });

  it("saves a new Quick Screen", () => {
    const { getResult } = testRenderer({
      displayInstance: {
        macros: {
          TEST: "value"
        },
        description: {
          type: "displayGridLayout",
          children: []
        }
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted
    });

    act(() => {
      getResult().save("my screen");
    });

    expect(localStorage.getItem("quickScreens/my screen")).toEqual(
      JSON.stringify({
        macros: {
          TEST: "value"
        },
        description: {
          type: "displayGridLayout",
          children: []
        }
      })
    );

    expect(onCompleted).toHaveBeenCalled();
  });

  it("fails to save if no name given", () => {
    const { getResult } = testRenderer({
      displayInstance: {
        macros: {},
        description: {}
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("");
    });

    expect(localStorage.length).toBe(0);
  });

  it("fails to save if no quick screen content", () => {
    const { getResult } = testRenderer({
      displayInstance: undefined,
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("screen");
    });

    expect(localStorage.length).toBe(0);
  });
  it("sets pending overwrite action when user needs to confirm overwrite", () => {
    localStorage.setItem(
      "quickScreens/test identical",
      JSON.stringify({
        macros: {},
        description: {
          type: "displayGridLayout"
        }
      })
    );

    const { getResult } = testRenderer({
      displayInstance: {
        macros: {
          NEW: "value"
        },
        description: {
          type: "displayGridLayout"
        }
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("test identical");
    });

    expect(getResult().pendingAction).toEqual({
      type: "overwrite",
      name: "test identical"
    });
  });

  it("confirms quick screen overwrite", () => {
    localStorage.setItem("quickScreens/test", "old");

    const onCompleted = vi.fn();

    const { getResult } = testRenderer({
      displayInstance: {
        macros: {
          NEW: "value"
        },
        description: { type: "displayGridLayout" }
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted
    });

    act(() => {
      getResult().save("test");
    });

    expect(getResult().pendingAction).toEqual({
      type: "overwrite",
      name: "test"
    });

    act(() => {
      getResult().confirmPendingAction();
    });

    expect(getResult().pendingAction).toBeNull();

    expect(onCompleted).toHaveBeenCalled();

    expect(localStorage.getItem("quickScreens/test")).toEqual(
      JSON.stringify({
        macros: {
          NEW: "value"
        },
        description: { type: "displayGridLayout" }
      })
    );
  });

  it("cancels quick screen overwrite", () => {
    localStorage.setItem("quickScreens/screen", "old");

    const { getResult } = testRenderer({
      displayInstance: {
        macros: {},
        description: { type: "displayGridLayout" }
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("screen");
    });

    expect(getResult().pendingAction).toEqual({
      type: "overwrite",
      name: "screen"
    });

    act(() => {
      getResult().cancelPendingAction();
    });

    expect(getResult().pendingAction).toBeNull();
  });

  it("sets pending delete action when deleting a Quick Screen", () => {
    localStorage.setItem("quickScreens/test", "content");

    const { getResult } = testRenderer({
      displayInstance: {},
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().requestDelete("test");
    });

    expect(getResult().pendingAction).toEqual({
      type: "delete",
      name: "test"
    });
  });

  it("confirms Quick Screen deletion", () => {
    localStorage.setItem("quickScreens/test", "content");

    const { getResult } = testRenderer({
      displayInstance: {},
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().requestDelete("test");
    });

    expect(getResult().pendingAction).toEqual({
      type: "delete",
      name: "test"
    });

    act(() => {
      getResult().confirmPendingAction();
    });

    expect(localStorage.getItem("quickScreens/test")).toBeNull();
    expect(getResult().pendingAction).toBeNull();

    expect(mockNavigate).toHaveBeenCalledWith("/quick-screens/", {
      state: {
        pageState: {
          bobQuickScreen: "test"
        }
      }
    });
  });

  it("cancels Quick Screen deletion", () => {
    localStorage.setItem("quickScreens/test", "content");

    const { getResult } = testRenderer({
      displayInstance: {},
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().requestDelete("test");
    });

    expect(getResult().pendingAction).toEqual({
      type: "delete",
      name: "test"
    });

    act(() => {
      getResult().cancelPendingAction();
    });

    expect(getResult().pendingAction).toBeNull();
    expect(localStorage.getItem("quickScreens/test")).toBe("content");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("loads an existing quick screen", () => {
    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          quickScreen: {
            path: "wow.bob",
            macros: {},
            defaultProtocol: "ca"
          }
        }
      }
    });
    const addDisplayInstanceByDescription = vi.fn();

    localStorage.setItem(
      "quickScreens/example",
      JSON.stringify({
        macros: {
          A: "B"
        },
        description: {
          type: "displayGridLayout"
        }
      })
    );

    const { getResult } = testRenderer({
      displayInstance: {},
      addDisplayInstanceByDescription,
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().load("example");
    });
    expect(addDisplayInstanceByDescription).toHaveBeenCalledWith(
      "example",
      {
        A: "B"
      },
      {
        type: "displayGridLayout"
      }
    );
  });

  it("does nothing when cannot find quick screen to load", () => {
    const addDisplayInstanceByDescription = vi.fn();

    const { getResult } = testRenderer({
      displayInstance: {},
      addDisplayInstanceByDescription,
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().load("nonexistent");
    });
    expect(addDisplayInstanceByDescription).not.toHaveBeenCalled();
  });
});

describe("getQuickScreens()", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty tree when there are no Quick Screens", () => {
    expect(getQuickScreens()).toEqual([]);
  });

  it("only uses Quick Screen local storage entries", () => {
    localStorage.setItem("someOtherKey", "value");
    localStorage.setItem("quickScreen/settings", "value");
    expect(getQuickScreens()).toEqual([]);
  });

  it("creates nested folder structure for path Quick Screen names", () => {
    localStorage.setItem("quickScreens/folder/testScreen", "{}");
    expect(getQuickScreens()).toEqual([
      {
        id: "folder",
        label: "folder",
        children: [
          {
            id: "folder/testScreen",
            label: "testScreen"
          }
        ]
      }
    ]);
  });

  it("creates multiple Quick Screens in same folder", () => {
    localStorage.setItem("quickScreens/folder/screenA", "{}");

    localStorage.setItem("quickScreens/folder/screenB", "{}");
    expect(getQuickScreens()).toEqual([
      {
        id: "folder",
        label: "folder",
        children: [
          {
            id: "folder/screenA",
            label: "screenA"
          },
          {
            id: "folder/screenB",
            label: "screenB"
          }
        ]
      }
    ]);
  });

  it("can create nested folders", () => {
    localStorage.setItem("quickScreens/a/b/c/screen", "{}");

    expect(getQuickScreens()).toEqual([
      {
        id: "a",
        label: "a",
        children: [
          {
            id: "a/b",
            label: "b",
            children: [
              {
                id: "a/b/c",
                label: "c",
                children: [
                  {
                    id: "a/b/c/screen",
                    label: "screen"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]);
  });

  it("does not create duplicate folders", () => {
    localStorage.setItem("quickScreens/folder/screen1", "{}");

    localStorage.setItem("quickScreens/folder/screen2", "{}");
    const result = getQuickScreens();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("folder");
    expect(result[0].children).toHaveLength(2);
  });

  it("sorts items alphabetically", () => {
    localStorage.setItem("quickScreens/z screen", "{}");

    localStorage.setItem("quickScreens/a screen", "{}");

    localStorage.setItem("quickScreens/m folder/b screen", "{}");

    localStorage.setItem("quickScreens/m folder/a screen", "{}");

    expect(getQuickScreens()).toEqual([
      {
        id: "a screen",
        label: "a screen"
      },
      {
        id: "m folder",
        label: "m folder",
        children: [
          {
            id: "m folder/a screen",
            label: "a screen"
          },
          {
            id: "m folder/b screen",
            label: "b screen"
          }
        ]
      },
      {
        id: "z screen",
        label: "z screen"
      }
    ]);
  });
});
