import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  SynopticPage,
  MenuContext,
  addTabCallbackAction
} from "../../routes/SynopticPage";
import { BeamlineTreeStateContext } from "../../App";
import {
  FileContext,
  FileContextType,
  FileDescription
} from "@diamondlightsource/cs-web-lib";
import { MemoryRouter } from "react-router-dom";
import * as parser from "../../utils/parser";
import * as csWebLibActions from "../../utils/csWebLibActions";
import {
  BeamlineState,
  BeamlineStateProperties,
  BeamlineTreeState,
  LOAD_SCREENS
} from "../../store";
import { useContext } from "react";

// Mock dependencies
vi.mock("../components/MenuBar", () => ({
  default: () => <div data-testid="mini-menu-bar">Menu Bar</div>
}));

vi.mock("../components/AppBar", () => ({
  default: ({ children, open }: { children: any; open: any }) => (
    <div data-testid="app-bar" data-open={open}>
      {children}
    </div>
  )
}));

vi.mock("../components/ScreenDisplay", () => ({
  default: () => <div data-testid="screen-display">Screen Display</div>
}));

vi.mock("../components/SynopticBreadcrumbs", () => ({
  SynopticBreadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>
}));

vi.mock("react-loader-spinner", () => ({
  RotatingLines: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe("SynopticPage", () => {
  const mockDispatch = vi.fn();
  const mockState = {
    filesLoaded: false,
    beamlines: {
      bl01: {
        host: "http://daedalus.ac.uk/",
        entryPoint: "entry-point",
        screenTree: {},
        filePathIds: {},
        topLevelScreen: "screen1",
        loaded: false
      } as Partial<BeamlineStateProperties> as BeamlineStateProperties
    } as Partial<BeamlineState> as BeamlineState,
    currentBeamline: "bl01",
    currentScreenUrlId: "screen1"
  } as Partial<BeamlineTreeState> as BeamlineTreeState;

  const mockFileContext = {
    addTab: vi.fn(),
    openDisplay: vi.fn(),
    closeDisplay: vi.fn(),
    pageState: {
      main: { path: "DummyPath", macros: {}, defaultProtocol: "ca" }
    }
  } as Partial<FileContextType> as FileContextType;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(parser, "parseScreenTree").mockResolvedValue([
      [],
      {},
      "firstFile"
    ]);
    vi.spyOn(
      csWebLibActions,
      "executeOpenPageActionWithUrlId"
    ).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading spinner when files are not loaded", () => {
    render(
      <BeamlineTreeStateContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <FileContext.Provider value={mockFileContext}>
          <MemoryRouter>
            <SynopticPage />
          </MemoryRouter>
        </FileContext.Provider>
      </BeamlineTreeStateContext.Provider>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("loads screens on mount", async () => {
    render(
      <BeamlineTreeStateContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <FileContext.Provider value={mockFileContext}>
          <MemoryRouter>
            <SynopticPage />
          </MemoryRouter>
        </FileContext.Provider>
      </BeamlineTreeStateContext.Provider>
    );

    await waitFor(() => {
      expect(parser.parseScreenTree).toHaveBeenCalledWith(
        "http://daedalus.ac.uk/entry-point"
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: LOAD_SCREENS,
        payload: {
          beamlines: expect.any(Object),
          loadBeamline: undefined,
          loadScreen: undefined
        }
      });
    });
  });
});

describe("addTabCallbackAction", () => {
  const mockBeamlines = {
    bl01: {
      host: "http://daedalus.ac.uk",
      filePathIds: {
        file1: {
          urlId: "screen1",
          file: "/path/to/file1",
          macros: [{ key: "value" }]
        },
        file2: {
          urlId: "screen2",
          file: "/path/to/file2",
          macros: [{ key: "value2" }]
        }
      }
    } as Partial<BeamlineStateProperties> as BeamlineStateProperties
  } as Partial<BeamlineState> as BeamlineState;

  const mockLocation = {
    origin: "http://daedalus.ac.uk",
    href: "http://daedalus.ac.uk/synoptic/bl01/screen1",
    pathname: "/synoptic/bl01/screen1"
  } as Location;

  beforeEach(() => {
    vi.spyOn(window, "open").mockImplementation(() => null as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens a new tab with correct URL when file mapping exists", () => {
    const addTab = addTabCallbackAction(mockBeamlines, "bl01", mockLocation);

    const fileDesc = {
      path: "/path/to/file1",
      macros: { key: "value" }
    } as Partial<FileDescription> as FileDescription;

    addTab("unused", "unused", fileDesc);
    const url = vi.mocked(window.open).mock.calls[0][0];
    expect(decodeURI(url?.toString() ?? "")).toContain("macros=");
    expect(url?.toString()).toContain(
      encodeURIComponent(JSON.stringify(fileDesc.macros)).replace(/%22/g, "%22")
    );

    expect(window.open).toHaveBeenCalledWith(expect.any(URL), "_blank");
  });

  it("opens a new tab with file description when no file mapping exists", () => {
    const addTab = addTabCallbackAction(mockBeamlines, "bl01", mockLocation);

    const fileDesc = {
      path: "http://daedalus.ac.uk/unknown/path",
      macros: { key: "value" }
    } as Partial<FileDescription> as FileDescription;

    addTab("unused", "unused", fileDesc);

    expect(window.open).toHaveBeenCalled();
    const url = vi.mocked(window.open).mock.calls[0][0];
    expect(url?.toString()).toContain("file_description=");
    expect(url?.toString()).toContain(
      encodeURIComponent(JSON.stringify(fileDesc)).replace(/%22/g, "%22")
    );

    expect(window.open).toHaveBeenCalledWith(expect.any(URL), "_blank");
  });
});

describe("MenuContext", () => {
  it("provides default values", () => {
    const TestComponent = () => {
      const { menuOpen, setMenuOpen } = useContext(MenuContext);

      // Expose the context values for testing
      return (
        <div data-testid="test-component" data-menu-open={menuOpen}>
          <button onClick={() => setMenuOpen(!menuOpen)}>Toggle</button>
        </div>
      );
    };

    // Render the test component
    const { getByTestId } = render(<TestComponent />);

    // Check that the default values are provided
    const testComponent = getByTestId("test-component");
    expect(testComponent.getAttribute("data-menu-open")).toBe("true");
  });
});
