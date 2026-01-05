export const isFullyQualifiedUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const buildFullyQualifiedUrl = (
  defaultBaseHost: string,
  ...args: (string | undefined)[]
) => {
  const path =
    args
      ?.filter(s => s != null && s !== "")
      .map(s => s?.replace(/\/+$/, "").replace(/^\/+/, ""))
      .join("/") ?? "";

  if (isFullyQualifiedUrl(path)) {
    const parsedUrl = new URL(path);
    return parsedUrl.toString();
  }

  if (isFullyQualifiedUrl(defaultBaseHost)) {
    const parsedUrl = new URL(path, defaultBaseHost);
    return parsedUrl.toString();
  }

  throw new Error(
    `Invalid base URL: ${defaultBaseHost} and args do not form a valid URL`
  );
};
