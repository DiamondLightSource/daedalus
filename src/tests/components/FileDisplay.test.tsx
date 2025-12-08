import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FileContext, refreshFile } from "@diamondlightsource/cs-web-lib";
import { FileState } from "../../store";
import FileDisplay from "../../components/FileDisplay";
import FileStateContext from "../../routes/DemoPage";

vi.mock("@diamondlightsource/cs-web-lib", async () => {
  const actual = await vi.importActual("@diamondlightsource/cs-web-lib");
  return {
    ...actual,
    refreshFile: vi.fn(),
    store: vi.fn(),
    EmbeddedDisplay: vi.fn()
  };
});

describe("FileDisplay Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFileContext = {
    subscribeToConnectionState: vi.fn(),
    unsubscribeFromConnectionState: vi.fn(),
    pageState: {},
    tabState: {},
    addPage: vi.fn(),
    removePage: vi.fn(),
    addTab: vi.fn(),
    removeTab: vi.fn(),
    selectTab: vi.fn()
  };

  const mockFileStateContext = {
    state: {
      nextFile: { protocol: "ca" },
      files: [
        {
          protocol: "ca",
          name: "folder/file1.bob",
          macros: {}
        },
        {
          protocol: "ca",
          name: "newFolder/file2.bob",
          macros: {}
        }
      ]
    } as unknown as FileState,
    dispatch: vi.fn()
  };

  const renderComponent = () => {
    return render(
      <FileContext.Provider value={mockFileContext}>
        <FileStateContext.Provider value={mockFileStateContext}>
          <FileDisplay />
        </FileStateContext.Provider>
      </FileContext.Provider>
    );
  };

  it("renders tabs correctly for two files", () => {
    renderComponent();

    expect(screen.getByText("file1.bob")).toBeInTheDocument();
    expect(screen.getByText("file2.bob")).toBeInTheDocument();

    // Check there are two tabs
    expect(screen.getAllByRole("tab").length).toEqual(2);
  });

  it("removes tab on button click", () => {
    renderComponent();

    const closeButtons = screen.getAllByTestId("CloseIcon");
    fireEvent.click(closeButtons[0]);

    expect(mockFileStateContext.dispatch).toHaveBeenCalledOnce();
  });
  it("refreshes file on button click", () => {
    renderComponent();

    const refreshButtons = screen.getAllByTestId("RefreshIcon");
    fireEvent.click(refreshButtons[1]);

    expect(refreshFile).toHaveBeenCalledOnce();
  });

  it("changes tabs correctly", () => {
    renderComponent();

    const tabs = screen.getAllByRole("tab");

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });
});
