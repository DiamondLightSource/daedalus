import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickScreenSettings from "../../components/QuickScreens/Settings";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { StorageContext } from "../../contexts/LocalStorageContext";

vi.mock("../../utils/csWebLibActions", () => ({
  executeOpenQuickScreen: vi.fn()
}));

const { executeOpenQuickScreen } = await import("../../utils/csWebLibActions");

vi.mock("@diamondlightsource/cs-web-lib", async importOriginal => {
  const actual =
    await importOriginal<typeof import("@diamondlightsource/cs-web-lib")>();
  return {
    ...actual,
    useDisplayInstance: vi.fn(() => ({
      addDisplayInstanceByDescription: vi.fn(),
      removeDisplayInstance: vi.fn()
    }))
  };
});

vi.mock("react", async importOriginal => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useId: vi.fn(() => "123")
  };
});

const renderComponent = (
  restoreQuickScreenSession = vi.fn(),
  setQuickScreenEditable = vi.fn()
) => {
  return render(
    <StorageContext.Provider
      value={
        {
          setBrowsingMode: vi.fn(),
          restoreQuickScreenSession,
          setQuickScreenEditable
        } as any
      }
    >
      <FileContext.Provider value={undefined as any}>
        <QuickScreenSettings />
      </FileContext.Provider>
    </StorageContext.Provider>
  );
};

describe("<QuickScreenSettings />", () => {
  it("renders all buttons", () => {
    const { container, getByText } = renderComponent();

    expect(getByText("New")).toBeInTheDocument();
    expect(getByText("Add")).toBeInTheDocument();
    expect(getByText("Save")).toBeInTheDocument();
    expect(getByText("Load")).toBeInTheDocument();
    expect(getByText("Restore")).toBeInTheDocument();

    // Check all four icons appear
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("loads a blank quick screen when new button clicked", () => {
    const { getByRole } = renderComponent();
    fireEvent.click(getByRole("button", { name: /new/i }));
    expect(executeOpenQuickScreen).toHaveBeenCalledTimes(1);
    expect(executeOpenQuickScreen).toHaveBeenCalledWith(
      "",
      "quickScreen",
      { LCID: "123" },
      undefined,
      ""
    );
  });

  it("verified that the restore setting delegates to the restore callback", () => {
    const restoreQuickScreenSession = vi.fn();

    const { getByRole } = renderComponent(restoreQuickScreenSession);
    fireEvent.click(getByRole("button", { name: /restore/i }));

    expect(restoreQuickScreenSession).toHaveBeenCalledTimes(1);
  });
});
