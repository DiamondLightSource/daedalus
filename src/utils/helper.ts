import { useState, useEffect } from "react";

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
