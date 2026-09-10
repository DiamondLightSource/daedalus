import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickScreenSettings from "../../components/QuickScreens/Settings";
import { StorageContext } from "../../components/QuickScreens/Display";
import { FileContext } from "@diamondlightsource/cs-web-lib";

vi.mock("../../utils/csWebLibActions", () => ({
  executeOpenQuickScreen: vi.fn()
}));

const { executeOpenQuickScreen } = await import("../../utils/csWebLibActions");

const renderComponent = () => {
  return render(
    <StorageContext.Provider
      value={
        {
          setBrowsingMode: vi.fn()
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

    // Check all four icons appear
    expect(container.querySelectorAll("svg")).toHaveLength(4);
  });

  it("loads a blank quick screen when new button clicked", () => {
    const { getByRole } = renderComponent();
    fireEvent.click(getByRole("button", { name: /new/i }));

    expect(executeOpenQuickScreen).toHaveBeenCalledTimes(1);
    expect(executeOpenQuickScreen).toHaveBeenCalledWith(
      "/new.bob",
      "quickScreen",
      {},
      undefined,
      ""
    );
  });
});
