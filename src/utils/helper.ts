import { useState, useEffect } from "react";

export const DRAWER_WIDTH = 300;
export const TRACES_PANEL_HEIGHT = 300;
export const APP_BAR_HEIGHT = 65;
export const PROPERTIES_MENU_WIDTH = 350;

function getWindowWidth() {
  const { innerWidth: width } = window;
  return width;
}

function getWindowHeight() {
  const { innerHeight: height } = window;
  return height;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}

export function useWindowHeight() {
  const [windowHeight, setWindowHeight] = useState(getWindowHeight());

  useEffect(() => {
    function handleResize() {
      setWindowHeight(getWindowHeight());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowHeight;
}

export function isValidHttpUrl(text: string) {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
