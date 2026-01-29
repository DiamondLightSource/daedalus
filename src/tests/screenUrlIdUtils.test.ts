import { describe, expect, it } from "vitest";
import {
  buildSynopticScreenPath,
  buildUrlId,
  extractAncestorScreens,
  extractDisplayNameFromScreenUrlId,
  parseScreenUrlId
} from "../utils/screenUrlIdUtils";

const EXPECTED_SEPARATOR = "+";

describe("buildUrlId()", (): void => {
  it("uses the file name if no display name", (): void => {
    const { urlId, fileLabel } = buildUrlId("testing.bob", "", undefined);

    expect(urlId).toBe("testing");
    expect(fileLabel).toBe("testing");
  });

  it("uses display name as url id", (): void => {
    const { urlId, fileLabel } = buildUrlId("testing.bob", "", "My File");

    expect(urlId).toBe("My File");
    expect(fileLabel).toBe("My File");
  });

  it("correctly attaches a prefix", (): void => {
    const { urlId, fileLabel } = buildUrlId(
      "testing.bob",
      "First File",
      "My File"
    );

    expect(urlId).toBe(`First File${EXPECTED_SEPARATOR}My File`);
    expect(fileLabel).toBe("My File");
  });
});

describe("extractAncestorScreens", () => {
  it("returns single ancestor when there is only one segment", () => {
    const input = "Home";
    const result = extractAncestorScreens(input);

    expect(result).toEqual([{ displayName: "Home", path: "Home" }]);
  });

  it("builds cumulative paths for multiple segments", () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}Profile`;
    const result = extractAncestorScreens(input);

    expect(result).toEqual([
      { displayName: "Home", path: "Home" },
      { displayName: "Settings", path: `Home${EXPECTED_SEPARATOR}Settings` },
      {
        displayName: "Profile",
        path: `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}Profile`
      }
    ]);
  });

  it("handles empty string input (returns empty array)", () => {
    const input = "";
    const result = extractAncestorScreens(input);

    expect(result).toEqual([]);
  });

  it("removes empty segments when there are consecutive separators", () => {
    const input = `Home${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Profile`;
    const result = extractAncestorScreens(input);

    expect(result).toEqual([
      { displayName: "Home", path: "Home" },
      { displayName: "Settings", path: `Home${EXPECTED_SEPARATOR}Settings` },
      {
        displayName: "Profile",
        path: `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}Profile`
      }
    ]);
  });

  it("handles leading separator (no leading empty segment)", () => {
    const input = `${EXPECTED_SEPARATOR}Home${EXPECTED_SEPARATOR}Settings`;
    const result = extractAncestorScreens(input);

    expect(result).toEqual([
      { displayName: "Home", path: "Home" },
      { displayName: "Settings", path: `Home${EXPECTED_SEPARATOR}Settings` }
    ]);
  });

  it("handles trailing separator (no trailing empty segment)", () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}`;
    const result = extractAncestorScreens(input);

    // Split: ['Home', 'Settings', '']
    expect(result).toEqual([
      { displayName: "Home", path: "Home" },
      { displayName: "Settings", path: `Home${EXPECTED_SEPARATOR}Settings` }
    ]);
  });

  it("works with names containing special characters and spaces", () => {
    const input = `Home${EXPECTED_SEPARATOR}User Settings${EXPECTED_SEPARATOR}Billing/Invoices`;
    const result = extractAncestorScreens(input);

    expect(result).toEqual([
      { displayName: "Home", path: "Home" },
      {
        displayName: "User Settings",
        path: `Home${EXPECTED_SEPARATOR}User Settings`
      },
      {
        displayName: "Billing/Invoices",
        path: `Home${EXPECTED_SEPARATOR}User Settings${EXPECTED_SEPARATOR}Billing/Invoices`
      }
    ]);
  });

  it("does not mutate the input string", () => {
    const input = `A${EXPECTED_SEPARATOR}B`;
    const before = input;
    extractAncestorScreens(input);
    expect(input).toBe(before);
  });

  it("returns an array with correct length equal to number of segments", () => {
    const input = `A${EXPECTED_SEPARATOR}B${EXPECTED_SEPARATOR}C${EXPECTED_SEPARATOR}D`;
    const result = extractAncestorScreens(input);
    expect(result).toHaveLength(4);
  });

  it("each path is the join of segments up to current index", () => {
    const input = `A${EXPECTED_SEPARATOR}B${EXPECTED_SEPARATOR}C`;
    const result = extractAncestorScreens(input);

    const expectedPaths = [
      "A",
      `A${EXPECTED_SEPARATOR}B`,
      `A${EXPECTED_SEPARATOR}B${EXPECTED_SEPARATOR}C`
    ];
    expect(result.map(r => r.path)).toEqual(expectedPaths);
    expect(result.map(r => r.displayName)).toEqual(["A", "B", "C"]);
  });
});

describe("extractDisplayNameFromScreenUrlId", () => {
  it("returns the display name when there is only one segment", () => {
    const input = "Home";
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Home");
  });

  it("returns the last segment when multiple segments are present", () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}Profile`;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Profile");
  });

  it("returns an empty string when input is an empty string", () => {
    const input = "";
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("");
  });

  it("returns an last non-empty segment string when the input ends with a separator", () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}`;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Settings");
  });

  it("returns an empty string when the input is only a separator", () => {
    const input = EXPECTED_SEPARATOR;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("");
  });

  it("handles consecutive separators by returning the last segment", () => {
    const input = `Home${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Profile`;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Profile");
  });

  it("handles leading separator by returning the last valid segment", () => {
    const input = `${EXPECTED_SEPARATOR}Home${EXPECTED_SEPARATOR}Settings`;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Settings");
  });

  it("preserves spaces and special characters in the display name", () => {
    const input = `Home${EXPECTED_SEPARATOR}User Settings${EXPECTED_SEPARATOR}Billing/Invoices`;
    const result = extractDisplayNameFromScreenUrlId(input);

    expect(result).toBe("Billing/Invoices");
  });

  it("does not mutate the input string", () => {
    const input = "A${EXPECTED_SEPARATOR}B";
    const before = input;

    extractDisplayNameFromScreenUrlId(input);

    expect(input).toBe(before);
  });
});

describe("parseScreenUrlId", () => {
  it("returns a single segment when there is only one screen", () => {
    const input = "Home";
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home"]);
  });

  it('splits multiple segments by "+" and removes empties', () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}Profile`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "Settings", "Profile"]);
  });

  it("returns an empty array for an empty string", () => {
    const input = "";
    const result = parseScreenUrlId(input);

    expect(result).toEqual([]);
  });

  it("removes leading empty segments (leading separator)", () => {
    const input = `${EXPECTED_SEPARATOR}Home${EXPECTED_SEPARATOR}Settings`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "Settings"]);
  });

  it("removes trailing empty segments (trailing separator)", () => {
    const input = `Home${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "Settings"]);
  });

  it("removes empty segments from consecutive separators", () => {
    const input = `Home${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Settings${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}Profile`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "Settings", "Profile"]);
  });

  it("returns empty array when the input is only separators", () => {
    const input = `${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual([]);
  });

  it("preserves spaces and special characters (no trimming performed)", () => {
    const input = `Home${EXPECTED_SEPARATOR}User Settings${EXPECTED_SEPARATOR}Billing/Invoices`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "User Settings", "Billing/Invoices"]);
  });

  it("does not include whitespace-only segments", () => {
    const input = `Home${EXPECTED_SEPARATOR}   ${EXPECTED_SEPARATOR}Settings`;
    const result = parseScreenUrlId(input);

    expect(result).toEqual(["Home", "Settings"]);
  });

  it("does not mutate the input string", () => {
    const input = `A${EXPECTED_SEPARATOR}B${EXPECTED_SEPARATOR}C`;
    const before = input;

    parseScreenUrlId(input);

    expect(input).toBe(before);
  });

  it("returns the correct length matching non-empty segments only", () => {
    const input = `A${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}B${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}${EXPECTED_SEPARATOR}C${EXPECTED_SEPARATOR}`;
    const result = parseScreenUrlId(input);

    expect(result).toHaveLength(3);
    expect(result).toEqual(["A", "B", "C"]);
  });
});

describe("buildSynopticScreenPath", () => {
  it("builds the correct synoptic path for valid inputs", () => {
    const result = buildSynopticScreenPath(
      "BL01",
      `Home${EXPECTED_SEPARATOR}Settings`
    );

    expect(result).toBe(`/synoptic/BL01/Home${EXPECTED_SEPARATOR}Settings`);
  });

  it("works with single-segment screenUrlId", () => {
    const result = buildSynopticScreenPath("BL02", "Overview");

    expect(result).toBe("/synoptic/BL02/Overview");
  });

  it("preserves special characters and separators in screenUrlId", () => {
    const result = buildSynopticScreenPath(
      "BL-α",
      `User Settings${EXPECTED_SEPARATOR}Billing/Invoices`
    );

    expect(result).toBe(
      `/synoptic/BL-α/User Settings${EXPECTED_SEPARATOR}Billing/Invoices`
    );
  });

  it("handles empty screenUrlId", () => {
    const result = buildSynopticScreenPath("BL03", "");

    expect(result).toBe("/synoptic/BL03/");
  });

  it("handles empty beamline", () => {
    const result = buildSynopticScreenPath("", "Home");

    expect(result).toBe("/synoptic//Home");
  });

  it("returns a path starting with a leading slash", () => {
    const result = buildSynopticScreenPath("BL04", "Dashboard");

    expect(result.startsWith("/")).toBe(true);
  });

  it("does not mutate input arguments", () => {
    const beamline = "BL05";
    const screenUrlId = "A${EXPECTED_SEPARATOR}B";

    const beamlineBefore = beamline;
    const screenUrlIdBefore = screenUrlId;

    buildSynopticScreenPath(beamline, screenUrlId);

    expect(beamline).toBe(beamlineBefore);
    expect(screenUrlId).toBe(screenUrlIdBefore);
  });

  it('always places "synoptic" as the first path segment', () => {
    const result = buildSynopticScreenPath("BL06", "Screen");

    expect(result.split("/")[1]).toBe("synoptic");
  });
});
