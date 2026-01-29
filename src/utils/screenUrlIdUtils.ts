const SCREEN_SEPARATOR = "/";

/**
 * Builds the ID to display in the URL, based on the file name
 * and/or a given display name
 * @param filepath string path of bob file
 * @param idPrefix string prefix of all parent file IDs
 * @param displayName string alternate name of file to display
 * @returns string ID of url, label to display for current file
 */
export const buildUrlId = (
  filepath: string,
  idPrefix: string,
  displayName?: string
) => {
  const splitFilePath = filepath.split(".bob")[0].split("/");
  let fileLabel: string = displayName || splitFilePath.pop()!;
  if (fileLabel === "index") {
    const parentDir = splitFilePath.pop();
    if (parentDir) {
      fileLabel = `${parentDir}__${fileLabel}`;
    }
  }
  const urlId = `${idPrefix}${idPrefix === "" ? "" : SCREEN_SEPARATOR}${fileLabel}`;
  return { urlId, fileLabel };
};

export const parseFullSynopticPath = (path: string): { beamline: string; screenUrlId: string } | null => {
  const m = path.match(/^\/synoptic\/([^/]+)\/(.*)$/);
  if (!m) return null;

  const [, beamline, screenUrlId] = m;
  return { beamline, screenUrlId };
}

export const parseScreenUrlId = (screenUrlId: string): string[] =>
  screenUrlId
    ?.split(SCREEN_SEPARATOR)
    ?.filter(screen => !!screen && screen.trim() != "");

export const extractAncestorScreens = (
  screenUrlId: string
): { displayName: string; path: string }[] => {
  const ancestorScreenDisplayNames = parseScreenUrlId(screenUrlId);
  const screenAncestry = ancestorScreenDisplayNames.map((screen, index) => {
    return {
      displayName: screen,
      path: ancestorScreenDisplayNames
        .slice(0, index + 1)
        .join(SCREEN_SEPARATOR)
    };
  });

  return screenAncestry;
};

export const extractDisplayNameFromScreenUrlId = (screenUrlId: string) =>
  parseScreenUrlId(screenUrlId).pop() || "";

export const buildSynopticScreenPath = (
  beamline: string,
  screenUrlId: string
): string => `/synoptic/${beamline}/${screenUrlId}`;
