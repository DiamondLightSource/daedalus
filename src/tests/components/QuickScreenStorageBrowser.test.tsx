import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StorageContext } from "../../components/QuickScreens/Display";
import LocalStorageBrowser, {
  getQuickScreens
} from "../../components/QuickScreens/StorageBrowser";

const mockSetModalOpen = vi.fn();
const mockShowWarning = vi.fn();
const mockShowError = vi.fn();

let mockFileContent: any = {
  macros: {
    TEST: "value"
  },
  description: "{type: 'display', children: []}"
};

vi.mock("@diamondlightsource/cs-web-lib", () => ({
  useDisplayInstance: () => mockFileContent,
  useNotification: () => ({
    showWarning: mockShowWarning,
    showError: mockShowError
  })
}));

vi.mock("../utils", () => ({
  getAllScreensWithChildrenItemIds: vi.fn((_screens, setter) => {
    setter([]);
  })
}));

const renderComponent = () =>
  render(
    <StorageContext.Provider value={{ bobDisplayUuid: "test" } as any}>
      <LocalStorageBrowser setModalOpen={mockSetModalOpen} />
    </StorageContext.Provider>
  );

describe("LocalStorageBrowser", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    mockFileContent = {
      macros: {
        TEST: "value"
      },
      description: "{type: 'display', children: []}"
    };
  });

  it("renders the component", () => {
    const { getByLabelText, getByRole } = renderComponent();

    expect(getByLabelText("Quick Screen Name")).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Save"
      })
    ).toBeDisabled();
  });

  it("loads Quick Screens from localStorage", async () => {
    localStorage.setItem(
      "quickScreens/test screen",
      JSON.stringify({
        macros: {},
        description: "hello"
      })
    );

    const { findByText } = renderComponent();

    expect(await findByText("test screen")).toBeInTheDocument();
  });

  it("allows entering a new quick screen name", async () => {
    const { getByRole, getByLabelText } = renderComponent();

    const input = getByLabelText("Quick Screen Name");
    fireEvent.change(input, {
      target: {
        value: "new screen"
      }
    });

    expect(input).toHaveValue("new screen");

    expect(
      getByRole("button", {
        name: "Save"
      })
    ).toBeEnabled();
  });

  it("saves a new quick screen", async () => {
    const { getByLabelText, getByRole } = renderComponent();

    const input = getByLabelText("Quick Screen Name");

    fireEvent.change(input, {
      target: {
        value: "my screen"
      }
    });

    fireEvent.click(
      getByRole("button", {
        name: "Save"
      })
    );

    expect(localStorage.getItem("quickScreens/my screen")).toBe(
      JSON.stringify({
        macros: {
          TEST: "value"
        },
        description: "{type: 'display', children: []}"
      })
    );

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("shows warning when no name is supplied", async () => {
    const { getByRole, getByLabelText } = renderComponent();

    const button = getByRole("button", {
      name: "Save"
    });

    expect(button).toBeDisabled();

    const input = getByLabelText("Quick Screen Name");

    fireEvent.change(input, {
      target: {
        value: " "
      }
    });

    fireEvent.click(button);

    expect(mockShowWarning).toHaveBeenCalledWith(
      "Unable to save: no Quick Screen name given."
    );
  });

  it("shows error when no file content exists", async () => {
    mockFileContent = undefined;

    const { getByLabelText, getByRole } = renderComponent();

    fireEvent.change(getByLabelText("Quick Screen Name"), {
      target: {
        value: "screen"
      }
    });

    await fireEvent.click(
      getByRole("button", {
        name: "Save"
      })
    );

    expect(mockShowError).toHaveBeenCalledWith(
      "Unable to save: no Quick Screen content found."
    );
  });

  it("opens overwrite dialog when screen already exists", async () => {
    localStorage.setItem(
      "quickScreens/existing",
      JSON.stringify({
        macros: {}
      })
    );

    const { getByLabelText, getByRole, findByText } = renderComponent();
    fireEvent.change(getByLabelText("Quick Screen Name"), {
      target: {
        value: "existing"
      }
    });

    await fireEvent.click(
      getByRole("button", {
        name: "Save"
      })
    );

    expect(await findByText("Overwrite Quick Screen?")).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Save and overwrite"
      })
    ).toBeInTheDocument();
  });

  it("overwrites an existing screen after confirmation", async () => {
    localStorage.setItem(
      "quickScreens/existing",
      JSON.stringify({
        macros: {},
        description: "{type: 'displayGridLayout', children: []}"
      })
    );

    const { getByLabelText, getByRole } = renderComponent();

    await fireEvent.change(getByLabelText("Quick Screen Name"), {
      target: {
        value: "existing"
      }
    });

    await fireEvent.click(
      await getByRole("button", {
        name: "Save"
      })
    );

    await fireEvent.click(
      await getByRole("button", {
        name: "Save and overwrite"
      })
    );

    expect(JSON.parse(localStorage.getItem("quickScreens/existing")!)).toEqual({
      macros: {
        TEST: "value"
      },
      description: "{type: 'display', children: []}"
    });

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("disables save when selecting a folder", async () => {
    localStorage.setItem("quickScreens/folder/file", "{}");

    const { findByText, getByRole } = renderComponent();

    const folder = await findByText("folder");

    fireEvent.click(folder);

    await waitFor(() => {
      expect(
        getByRole("button", {
          name: "Save"
        })
      ).toBeDisabled();
    });
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
