import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickScreenSettings from "../../components/QuickScreens/Settings";

const renderComponent = () => {
  return render(<QuickScreenSettings />);
};

const mockNavigate = vi.fn();
const mockLocation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation()
  };
});

describe("<QuickScreenSettings />", () => {
  it("renders all buttons", () => {
    const { container, getByText } = renderComponent();

    expect(getByText("New")).toBeInTheDocument();
    expect(getByText("Add")).toBeInTheDocument();
    expect(getByText("Save")).toBeInTheDocument();
    expect(getByText("Load")).toBeInTheDocument();
    expect(getByText("Delete")).toBeInTheDocument();

    // Check all five icons appear
    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("loads a blank quick screen when new button clicked", () => {
    mockLocation.mockReturnValue({
      state: {
        pageState: {}
      }
    });
    const { getByRole } = renderComponent();
    const button = getByRole("button", { name: /new/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/quick-screens/", {
      state: {
        pageState: {
          quickScreen: {
            path: "/new.bob",
            macros: {},
            defaultProtocol: "ca"
          }
        }
      },
      replace: true
    });
  });
});
