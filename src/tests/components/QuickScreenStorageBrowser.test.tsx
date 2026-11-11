import type { ContextType } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StorageContext } from "../../components/QuickScreens/Display";
import LocalStorageBrowser from "../../components/QuickScreens/StorageBrowser";
import { useQuickScreens } from "../../hooks/useQuickScreens";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";

const mocks = vi.hoisted(() => ({
  setModalOpen: vi.fn(),
  save: vi.fn(),
  load: vi.fn(),
  requestDelete: vi.fn(),
  setExpanded: vi.fn(),
  confirmPendingAction: vi.fn(),
  cancelPendingAction: vi.fn(),
  addDisplayInstanceByDescription: vi.fn(),
  removeDisplayInstance: vi.fn(),
  useDisplayInstance: vi.fn(),
  displayInstance: { id: "display-instance" }
}));

vi.mock("../../hooks/useQuickScreens", () => ({
  useQuickScreens: vi.fn()
}));

vi.mock("@diamondlightsource/cs-web-lib", async importOriginal => {
  const actual =
    await importOriginal<typeof import("@diamondlightsource/cs-web-lib")>();
  return {
    ...actual,
    useDisplayInstance: mocks.useDisplayInstance
  };
});

type HookReturn = ReturnType<typeof useQuickScreens>;

const defaultTree = [
  {
    id: "folder",
    label: "folder",
    children: [{ id: "folder/file", label: "file" }]
  }
];

const mockHook = (overrides: Partial<HookReturn> = {}) => {
  vi.mocked(useQuickScreens).mockReturnValue({
    tree: defaultTree,
    expanded: ["folder"],
    setExpanded: mocks.setExpanded,
    save: mocks.save,
    load: mocks.load,
    requestDelete: mocks.requestDelete,
    pendingAction: null,
    confirmPendingAction: mocks.confirmPendingAction,
    cancelPendingAction: mocks.cancelPendingAction,
    ...overrides
  });
};

const testStore = configureStore({
  reducer: {
    style: (state = { classes: {}, currentClass: "DEFAULT" }) => state
  }
});

const renderComponent = (browsingMode: "Save" | "Load" = "Save") =>
  render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={["/"]}>
        <StorageContext.Provider
          value={
            {
              bobDisplayUuid: "test",
              browsingMode
            } as ContextType<typeof StorageContext>
          }
        >
          <LocalStorageBrowser setModalOpen={mocks.setModalOpen} />
        </StorageContext.Provider>
      </MemoryRouter>
    </Provider>
  );

const nameInput = () => screen.getByLabelText("Quick Screen Name");
const actionButton = (name: "Save" | "Load") =>
  screen.getByRole("button", { name });
const typeName = (value: string) =>
  fireEvent.change(nameInput(), { target: { value } });

describe("LocalStorageBrowser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDisplayInstance.mockReturnValue({
      displayInstance: mocks.displayInstance,
      addDisplayInstanceByDescription: mocks.addDisplayInstanceByDescription,
      removeDisplayInstance: mocks.removeDisplayInstance
    });
    mockHook();
  });

  it("renders the name field and a disabled action button", () => {
    renderComponent("Load");

    expect(nameInput()).toHaveValue("");
    expect(actionButton("Load")).toBeDisabled();
  });

  it("labels action button with browsing mode", () => {
    const { unmount } = renderComponent("Save");
    expect(actionButton("Save")).toBeInTheDocument();
    unmount();

    renderComponent("Load");
    expect(actionButton("Load")).toBeInTheDocument();
  });

  it("renders the tree items from the hook, including expanded children", () => {
    renderComponent();

    expect(screen.getByText("folder")).toBeInTheDocument();
    expect(screen.getByText("file")).toBeInTheDocument();
  });

  it("renders the overwrite dialog when an action is pending", () => {
    mockHook({ pendingAction: { type: "overwrite", name: "folder/file" } });
    renderComponent();

    expect(screen.getByRole("dialog")).toHaveTextContent("folder/file");
  });

  it("gets the display instance for the context's bobDisplayUuid", () => {
    renderComponent();

    expect(mocks.useDisplayInstance).toHaveBeenCalledWith("test");
  });

  it("updates the name and enables the button when typing", () => {
    renderComponent();

    typeName("new screen");

    expect(nameInput()).toHaveValue("new screen");
    expect(actionButton("Save")).toBeEnabled();
  });

  it("calls save when Save button is clicked", () => {
    renderComponent("Save");

    typeName("screen");
    fireEvent.click(actionButton("Save"));

    expect(mocks.save).toHaveBeenCalledWith("screen");
    expect(mocks.load).not.toHaveBeenCalled();
  });

  it("calls load when Load button is clicked", () => {
    renderComponent("Load");

    typeName("screen");
    fireEvent.click(actionButton("Load"));

    expect(mocks.load).toHaveBeenCalledWith("screen");
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("disables save when selecting a folder", () => {
    renderComponent();

    typeName("folder");

    expect(actionButton("Save")).toBeDisabled();
  });

  it("fills the name field and enables the button when a file is selected", () => {
    renderComponent();

    fireEvent.click(screen.getByText("file"));

    expect(nameInput()).toHaveValue("folder/file");
    expect(actionButton("Save")).toBeEnabled();
  });

  it("shows delete buttons for files", () => {
    renderComponent();

    expect(
      screen.getByRole("button", { name: "Delete file" })
    ).toBeInTheDocument();
  });

  it("requests deletion when the delete button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Delete file" }));

    expect(mocks.requestDelete).toHaveBeenCalledTimes(1);
    expect(mocks.requestDelete).toHaveBeenCalledWith("folder/file");
  });
});
