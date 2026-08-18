import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import OverwriteDialog from "../../components/QuickScreens/OverwriteDialog";

const onConfirm = vi.fn();
const onCancel = vi.fn();

const mockUseLocation = vi.fn();

vi.mock("react-router", () => ({
  useLocation: () => mockUseLocation()
}));

describe("OverwriteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseLocation.mockReturnValue({
      state: undefined
    });
  });
  it("does not render when open=false", () => {
    const { queryByText } = render(
      <OverwriteDialog
        open={false}
        filename="test-screen"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isOverwrite={true}
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
        isOverwrite={true}
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

  it("renders the delete dialog correctly", () => {
    const { getByRole, getByText } = render(
      <OverwriteDialog
        open
        filename="motor/test"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isOverwrite={false}
      />
    );

    expect(getByRole("dialog")).toBeInTheDocument();

    expect(
      getByRole("heading", {
        name: "Delete Quick Screen?"
      })
    ).toBeInTheDocument();

    expect(getByText("motor/test")).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Cancel"
      })
    ).toBeInTheDocument();

    expect(
      getByRole("button", {
        name: "Confirm and delete"
      })
    ).toBeInTheDocument();
  });

  it("includes current view text when deleting the current screen", () => {
    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          quickScreen: {
            path: "motor/test"
          }
        }
      }
    });

    const { getByText } = render(
      <OverwriteDialog
        open
        filename="motor/test"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isOverwrite={false}
      />
    );

    expect(getByText(/in your current view/)).toBeInTheDocument();
  });

  it("does not include current view text when deleting a different screen", () => {
    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          quickScreen: {
            path: "motor/other"
          }
        }
      }
    });

    const { getByText, queryByText } = render(
      <OverwriteDialog
        open
        filename="motor/test"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isOverwrite={false}
      />
    );

    expect(getByText("motor/test")).toBeInTheDocument();

    expect(queryByText(/in your current view/)).not.toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const { getByRole } = render(
      <OverwriteDialog
        open
        filename="test-screen"
        onCancel={onCancel}
        onConfirm={vi.fn()}
        isOverwrite={true}
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
        isOverwrite={true}
      />
    );
    fireEvent.click(
      getByRole("button", {
        name: "Save and overwrite"
      })
    );
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Confirm and delete is clicked", () => {
    const { getByRole } = render(
      <OverwriteDialog
        open
        filename="test-screen"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
        isOverwrite={false}
      />
    );

    fireEvent.click(
      getByRole("button", {
        name: "Confirm and delete"
      })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
