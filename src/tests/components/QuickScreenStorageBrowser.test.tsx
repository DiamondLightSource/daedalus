import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { StorageContext } from "../../components/QuickScreens/Display";
import LocalStorageBrowser from "../../components/QuickScreens/StorageBrowser";
import { useQuickScreens } from "../../hooks/useQuickScreens";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const testStore = configureStore({
  reducer: {
    style: (state = { classes: {}, currentClass: "DEFAULT" }) => state
  }
});

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn()
}));

vi.mock("../../hooks/useQuickScreens", () => ({
  useQuickScreens: vi.fn()
}));

const mockSetModalOpen = vi.fn();
const mockShowWarning = vi.fn();
const mockShowError = vi.fn();
const mockSave = vi.fn();
const mockLoad = vi.fn();
const mockConfirmOverwrite = vi.fn();
const mockCancelOverwrite = vi.fn();

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

const renderComponent = (browsingMode?: string) =>
  render(
    <Provider store={testStore}>
      <StorageContext.Provider
        value={
          {
            bobDisplayUuid: "test",
            browsingMode: browsingMode ?? "Save"
          } as any
        }
      >
        <LocalStorageBrowser setModalOpen={mockSetModalOpen} />
      </StorageContext.Provider>
    </Provider>
  );

describe("LocalStorageBrowser", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(useQuickScreens).mockReturnValue({
      tree: [
        {
          id: "folder",
          label: "folder",
          children: [
            {
              id: "folder/file",
              label: "file"
            }
          ]
        }
      ],
      expanded: [],
      setExpanded: vi.fn(),
      save: mockSave,
      load: mockLoad,
      pendingOverwrite: null,
      confirmOverwrite: mockConfirmOverwrite,
      cancelOverwrite: mockCancelOverwrite
    });
    mockFileContent = {
      macros: {
        TEST: "value"
      },
      description: "{type: 'display', children: []}"
    };
  });

  it("renders the component", () => {
    const { getByLabelText, getByRole } = renderComponent("Load");

    expect(getByLabelText("Quick Screen Name")).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Load"
      })
    ).toBeDisabled();
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

  it("calls save when Save button is clicked", () => {
    const { getByLabelText, getByRole } = renderComponent();

    fireEvent.change(getByLabelText("Quick Screen Name"), {
      target: {
        value: "screen"
      }
    });

    fireEvent.click(
      getByRole("button", {
        name: "Save"
      })
    );

    expect(mockSave).toHaveBeenCalledWith("screen");
  });

  it("calls load when Load button is clicked", () => {
    const { getByLabelText, getByRole } = renderComponent("Load");

    fireEvent.change(getByLabelText("Quick Screen Name"), {
      target: {
        value: "screen"
      }
    });

    fireEvent.click(
      getByRole("button", {
        name: "Load"
      })
    );

    expect(mockLoad).toHaveBeenCalledWith("screen");
  });

  it("disables save when selecting a folder", async () => {
    localStorage.setItem("quickScreens/folder/file", "{}");

    const { getByRole, findByText } = renderComponent();

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
