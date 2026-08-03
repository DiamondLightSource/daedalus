import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import OverwriteDialog from "../../components/QuickScreens/OverwriteDialog";

const onConfirm = vi.fn();
const onCancel = vi.fn();

describe("OverwriteDialog", () => {
  it("does not render when open=false", () => {
    const { queryByText } = render(
      <OverwriteDialog
        open={false}
        filename="test-screen"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(queryByText("Overwrite Quick Screen?")).not.toBeInTheDocument();
  });

  it("renders the dialog correctly when open=true", () => {
    const { getByRole, getByText } = render(
      <OverwriteDialog
        open
        filename="motor/test"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(getByRole("dialog")).toBeInTheDocument();

    expect(getByText("Overwrite Quick Screen?")).toBeInTheDocument();

    expect(getByText("motor/test")).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Cancel"
      })
    ).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Save and overwrite"
      })
    ).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const { getByRole } = render(
      <OverwriteDialog
        open
        filename="test-screen"
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />
    );

    fireEvent.click(
      getByRole("button", {
        name: "Cancel"
      })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Save and overwrite is clicked", () => {
    const { getByRole } = render(
      <OverwriteDialog
        open
        filename="test-screen"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(
      getByRole("button", {
        name: "Save and overwrite"
      })
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
