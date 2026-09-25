import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import QuickScreens from "../../components/QuickScreens/Display";
import { fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const testStore = configureStore({
  reducer: {
    style: (state = { classes: {}, currentClass: "DEFAULT" }) => state
  }
});

let mockFileContent: any = {
  macros: {
    TEST: "value"
  },
  displayInstance: {
    description: {
      gridLayout: []
    }
  },
  description: "{type: 'display', children: []}",
  addDisplayInstanceByDescription: vi.fn(),
  removeDisplayInstance: vi.fn()
};

const renderComponent = () => {
  return render(
    <Provider store={testStore}>
      <QuickScreens />
    </Provider>
  );
};

const mockUseLocation = vi.fn();

type MockBobQuickScreen = {
  path: string;
  macros: Record<string, string>;
  defaultProtocol: string;
};

const mockFileContext = vi.hoisted(() => ({
  pageState: {
    bobQuickScreen: undefined as MockBobQuickScreen | undefined,
    quickScreen: undefined as MockBobQuickScreen | undefined
  },
  removePage: vi.fn(),
  updatePage: vi.fn()
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

  mockUseLocation.mockReturnValue({
    state: undefined
  });

  mockFileContext.pageState.bobQuickScreen = undefined;
  mockFileContext.pageState.quickScreen = undefined;
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
    useDisplayInstance: () => mockFileContent,
    DynamicPageWidget: (props: any) => {
      vi.fn(props);
      return <div data-testid="dynamic-page-widget" />;
    }
  };
});

describe("<QuickScreens />", () => {
  it("shows placeholder text when no Quick Screen opened", () => {
    mockFileContext.pageState.quickScreen = undefined;

    const { getByText } = renderComponent();

    expect(getByText("No Quick Screen Loaded")).toBeInTheDocument();
  });

  it("renders a dynamic page view when fileContext.state exists", () => {
    mockFileContext.pageState.quickScreen = {
      path: "wow.bob",
      macros: {},
      defaultProtocol: "ca"
    };

    const { queryByText, getByTestId } = renderComponent();

    expect(getByTestId("dynamic-page-widget")).toBeInTheDocument();

    expect(queryByText("No Quick Screen loaded")).not.toBeInTheDocument();
  });

  it("displays a dialog box before closing on unsaved quick screen", () => {
    mockFileContext.pageState.quickScreen = {
      path: "wow.bob",
      macros: {},
      defaultProtocol: "ca"
    };

    const { getByText, getByRole } = renderComponent();
    fireEvent.click(getByRole("button", { name: /close quick screen/i }));
    expect(
      getByText(
        "This Quick Screen is not saved. Are you sure you want to close it?"
      )
    ).toBeInTheDocument();
  });

  it("doesn't display a dialog box when closing a saved quick screen", () => {
    mockFileContext.pageState.quickScreen = {
      path: "wow.bob",
      macros: {},
      defaultProtocol: "ca"
    };

    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        description: {
          gridLayout: []
        }
      })
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
    mockFileContext.pageState.quickScreen = {
      path: "wow.bob",
      macros: {},
      defaultProtocol: "ca"
    };

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
