import type { ReactNode } from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setCurrentClass } from "@diamondlightsource/cs-web-lib";
import { DiamondDSTheme } from "@diamondlightsource/sci-react-ui";
import DLSAppBar from "../../components/AppBar";

const mocks = vi.hoisted(() => ({
  loadConfig: vi.fn()
}));

vi.mock("../../config", () => ({
  loadConfig: mocks.loadConfig
}));

type RenderOptions = Partial<{
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  synopticView: boolean;
  showMenuButton: boolean;
  children: ReactNode;
  mode: "light" | "dark";
}>;

const renderComponent = async ({
  title = "",
  open = false,
  setOpen = vi.fn(),
  synopticView,
  showMenuButton,
  children,
  mode
}: RenderOptions = {}) => {
  const store = configureStore({
    reducer: {
      style: (state = { classes: {}, currentClass: "DEFAULT" }) => state
    }
  });
  const dispatchSpy = vi.spyOn(store, "dispatch");

  const appBar = (
    <DLSAppBar
      title={title}
      open={open}
      setOpen={setOpen}
      synopticView={synopticView as boolean}
      showMenuButton={showMenuButton}
    >
      {children}
    </DLSAppBar>
  );

  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        {mode ? (
          <ThemeProvider theme={DiamondDSTheme} defaultMode={mode}>
            {appBar}
          </ThemeProvider>
        ) : (
          appBar
        )}
      </MemoryRouter>
    </Provider>
  );

  // let the loadConfig promise resolve and its state update flush
  await act(async () => {
    await Promise.resolve();
  });

  return { ...result, setOpen, dispatchSpy };
};

const menuButton = () => screen.getByRole("button", { name: "menu" });

describe("<DLSAppBar />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.loadConfig.mockResolvedValue({ siteLogo: undefined });
  });

  it("renders a logo with link to home page", async () => {
    await renderComponent();

    const homeLink = screen.getByLabelText("Go to home page");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders the site logo from config", async () => {
    mocks.loadConfig.mockResolvedValue({ siteLogo: "/custom-logo.png" });
    await renderComponent();

    await waitFor(() => {
      const img = screen.getByLabelText("Go to home page").querySelector("img");
      expect(img).toHaveAttribute("src", "/custom-logo.png");
    });
  });

  it("renders the title when provided", async () => {
    await renderComponent({ title: "My Page" });

    expect(screen.getByText("My Page")).toBeInTheDocument();
  });

  it("renders children when provided", async () => {
    await renderComponent({
      children: <div data-testid="test-child">Test Child</div>
    });

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
  it("shows menubutton by default", async () => {
    await renderComponent();

    expect(menuButton()).toBeInTheDocument();
  });

  it("hides menubutton when showMenuButton is false", async () => {
    await renderComponent({ showMenuButton: false });

    expect(
      screen.queryByRole("button", { name: "menu" })
    ).not.toBeInTheDocument();
  });

  it("opens menu when closed", async () => {
    const { setOpen } = await renderComponent({ open: false });

    fireEvent.click(menuButton());

    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(true);
  });

  it("closes menu when open", async () => {
    const { setOpen } = await renderComponent({ open: true });

    fireEvent.click(menuButton());

    expect(setOpen).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("does not render BeamlineSelect by default", async () => {
    await renderComponent();

    expect(
      screen.queryByTestId("beamline-select-button")
    ).not.toBeInTheDocument();
  });

  it("renders BeamlineSelect when synopticView is true", async () => {
    await renderComponent({ synopticView: true });

    expect(screen.getByTestId("beamline-select-button")).toBeInTheDocument();
  });

  it("opens settings menu when clicked", async () => {
    await renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "open settings" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("dispatches the DARKMODE class when the mode is dark", async () => {
    const { dispatchSpy } = await renderComponent({ mode: "dark" });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(setCurrentClass("DARKMODE"));
    });
  });

  it("dispatches the DEFAULT class when the mode is light", async () => {
    const { dispatchSpy } = await renderComponent({ mode: "light" });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(setCurrentClass("DEFAULT"));
    });
    expect(dispatchSpy).not.toHaveBeenCalledWith(setCurrentClass("DARKMODE"));
  });

  it("dispatches the DEFAULT class when there is no colour scheme", async () => {
    const { dispatchSpy } = await renderComponent();

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(setCurrentClass("DEFAULT"));
    });
    expect(dispatchSpy).not.toHaveBeenCalledWith(setCurrentClass("DARKMODE"));
  });

  it("dispatches DARKMODE when the mode changes from light to dark", async () => {
    const { dispatchSpy } = await renderComponent({
      mode: "light"
    });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(setCurrentClass("DEFAULT"));
    });

    const colourSchemeButton = screen.getByRole("button", {
      name: "Colour scheme switcher: light"
    });

    fireEvent.click(colourSchemeButton);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenLastCalledWith(setCurrentClass("DARKMODE"));
    });
  });
});
