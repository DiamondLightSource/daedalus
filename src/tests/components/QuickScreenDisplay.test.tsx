import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickScreens from "../../components/QuickScreens/Display";

const renderComponent = () => {
  return render(<QuickScreens />);
};

const mockUseLocation = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useNavigate: () => vi.fn()
  };
});

vi.mock("@diamondlightsource/cs-web-lib", async () => {
  const actual = await vi.importActual("@diamondlightsource/cs-web-lib");
  return {
    ...actual,
    DynamicPageWidget: (props: any) => {
      vi.fn(props);
      return <div data-testid="dynamic-page-widget" />;
    }
  };
});

describe("<QuickScreens />", () => {
  it("shows placeholder text when no Quick Screen opened", () => {
    mockUseLocation.mockReturnValue({ state: undefined });

    const { getByText } = renderComponent();

    expect(getByText("No Quick Screen Loaded")).toBeInTheDocument();
  });

  it("renders a dynamic page view when location.state exists", () => {
    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          quickScreen: {
            path: "wow.bob",
            macros: {},
            defaultProtocol: "ca"
          }
        }
      }
    });

    const { queryByText, getByTestId } = renderComponent();

    expect(getByTestId("dynamic-page-widget")).toBeInTheDocument();

    expect(queryByText("No Quick Screen loaded")).not.toBeInTheDocument();
  });
});
