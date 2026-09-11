import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import QuickScreens from "../../components/QuickScreens/Display";
import { fireEvent } from "@testing-library/react";

const renderComponent = () => {
  return render(<QuickScreens />);
};

const mockUseLocation = vi.fn();

type MockBobQuickScreen = {
  path: string;
  macros: Record<string, string>;
  defaultProtocol: string;
  saved?: boolean;
};

const mockFileContext = vi.hoisted(() => ({
  pageState: {
    bobQuickScreen: undefined as MockBobQuickScreen | undefined
  },
  removePage: vi.fn()
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true
});

beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.clear();
  mockFileContext.pageState.bobQuickScreen = undefined;
});

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
  const { createContext } = await import("react");

  return {
    ...actual,
    FileContext: createContext(mockFileContext),
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

  it("displays a dialog box before closing on unsaved quick screen", () => {
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

    const { getByText, getByRole } = renderComponent();
    fireEvent.click(getByRole("button", { name: /close quick screen/i }));
    expect(
      getByText(
        "This Quick Screen is not saved. Are you sure you want to close it?"
      )
    ).toBeInTheDocument();
  });

  it("doesn't display a dialog box when closing a saved quick screen", () => {
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

    mockLocalStorage.getItem.mockImplementation((key: string) =>
      key === "quickScreens/wow.bob" ? "saved" : null
    );

    const { queryByText, getByRole } = renderComponent();
    fireEvent.click(getByRole("button", { name: /close quick screen/i }));
    expect(
      queryByText(
        "This Quick Screen is not saved. Are you sure you want to close it?"
      )
    ).not.toBeInTheDocument();
  });

  it("shows name of quick screen when opened", () => {
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

    const { getByText } = renderComponent();

    expect(getByText("Quick Screen : wow.bob")).toBeInTheDocument();
  });

  it("shows the breadcrumbs of the bobquickscreen when opened", () => {
    mockFileContext.pageState.bobQuickScreen = {
      path: "wow.bob",
      macros: {},
      defaultProtocol: "ca"
    };

    mockUseLocation.mockReturnValue({
      state: {
        pageState: {
          bobScreenUrlId: "Page 1/Page 2/Motor X"
        }
      }
    });

    const { getByText } = renderComponent();

    expect(getByText("Page 1")).toBeInTheDocument();
    expect(getByText("Page 2")).toBeInTheDocument();
    expect(getByText("Motor X")).toBeInTheDocument();
  });
});
