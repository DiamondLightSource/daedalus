import { describe, beforeEach, it, expect, vi } from "vitest";
import { useQuickScreens, getQuickScreens } from "../../hooks/useQuickScreens";
import { act, render, waitFor } from "@testing-library/react";

const {
  mockExecuteOpenQuickScreen,
  mockExecuteCloseQuickScreen,
  mockShowWarning,
  mockShowError
} = vi.hoisted(() => ({
  mockExecuteOpenQuickScreen: vi.fn(),
  mockExecuteCloseQuickScreen: vi.fn(),
  mockShowWarning: vi.fn(),
  mockShowError: vi.fn()
}));

vi.mock("../../utils/csWebLibActions", () => ({
  executeOpenQuickScreen: mockExecuteOpenQuickScreen,
  executeCloseQuickScreen: mockExecuteCloseQuickScreen
}));

vi.mock("@diamondlightsource/cs-web-lib", () => ({
  FileContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children
  },
  useNotification: () => ({
    showWarning: mockShowWarning,
    showError: mockShowError
  })
}));

vi.mock("react-router", () => ({
  useLocation: () => ({
    state: {
      pageState: {
        bobQuickScreen: "test"
      }
    }
  })
}));

vi.mock("@diamondlightsource/cs-web-lib", () => ({
  FileContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children
  },
  useNotification: () => ({
    showWarning: mockShowWarning,
    showError: mockShowError
  })
}));

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

  it("loads an existing Quick Screen", () => {
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

    expect(mockExecuteOpenQuickScreen).toHaveBeenCalledWith(
      "example",
      "quickScreen",
      {
        A: "B"
      },
      undefined,
      ""
    );
  });

  it("does nothing when it cannot find a Quick Screen to load", () => {
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
    expect(mockExecuteOpenQuickScreen).not.toHaveBeenCalled();
    expect(mockShowWarning).toHaveBeenCalledWith(
      "Unable to load: no Quick Screen found."
    );
  });

  it("saves a new Quick Screen", () => {
    const onCompleted = vi.fn();

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
    expect(mockShowWarning).toHaveBeenCalledWith(
      "Unable to save: no Quick Screen name given."
    );
  });

  it("fails to save if no quick screen content", () => {
    const { getResult } = testRenderer({
      displayInstance: {
        macros: {},
        description: {}
      },
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("   ");
    });

    expect(localStorage.length).toBe(0);
    expect(mockShowWarning).toHaveBeenCalledWith(
      "Unable to save: no Quick Screen name given."
    );
  });

  it("fails to save if there is no Quick Screen content", () => {
    const { getResult } = testRenderer({
      displayInstance: undefined,
      addDisplayInstanceByDescription: vi.fn(),
      onCompleted: vi.fn()
    });

    act(() => {
      getResult().save("screen");
    });

    expect(localStorage.length).toBe(0);
    expect(mockShowError).toHaveBeenCalledWith(
      "Unable to save: no Quick Screen content found."
    );
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
    expect(localStorage.getItem("quickScreens/screen")).toBe("old");
  });

  it("sets pending delete action when deleting a Quick Screen", () => {
    localStorage.setItem(
      "quickScreens/test",
      JSON.stringify({
        macros: {},
        description: {}
      })
    );

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
    localStorage.setItem(
      "quickScreens/test",
      JSON.stringify({
        macros: {
          TEST: "value"
        },
        description: {
          type: "displayGridLayout"
        }
      })
    );

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

    expect(mockExecuteCloseQuickScreen).toHaveBeenCalledWith(
      "test",
      "quickScreen",
      {
        TEST: "value"
      },
      undefined
    );
  });

  it("cancels Quick Screen deletion", () => {
    const content = JSON.stringify({
      macros: {},
      description: {
        type: "displayGridLayout"
      }
    });

    localStorage.setItem("quickScreens/test", content);

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
    expect(localStorage.getItem("quickScreens/test")).toBe(content);
    expect(mockExecuteCloseQuickScreen).not.toHaveBeenCalled();
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
