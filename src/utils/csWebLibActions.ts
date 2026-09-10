import { buildUrl, executeAction } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties, FileMetadata, MacroMap } from "../store";

export const executeOpenPageActionWithFileGuid = (
  beamlineState: BeamlineStateProperties,
  fileGuid: string,
  selectedBeamlineId: string,
  fileContext: any,
  path?: string,
  replace?: boolean
) => {
  const fileMetadata = beamlineState.filePathIds[fileGuid];
  executeOpenPageActionWithFileMetadata(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext,
    undefined,
    path,
    replace
  );
};

export const executeOpenPageActionWithUrlId = (
  beamlineState: BeamlineStateProperties,
  urlId: string | undefined,
  selectedBeamlineId: string,
  fileContext: any,
  extraMacros?: MacroMap,
  path?: string,
  replace?: boolean
) => {
  const fileMetadata = Object.values(beamlineState.filePathIds).find(
    x => x.urlId === (urlId ?? "index")
  );

  executeOpenPageActionWithFileMetadata(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext,
    extraMacros,
    path,
    replace
  );
};

export const executeOpenPageActionWithFileMetadata = (
  beamlineState: BeamlineStateProperties,
  fileMetadata: FileMetadata | undefined,
  selectedBeamlineId: string,
  fileContext: any,
  overrideMacros?: MacroMap,
  path?: string,
  replace?: boolean
) => {
  const newScreen = buildUrl(
    beamlineState.host,
    fileMetadata?.file ?? beamlineState.topLevelScreen
  );

  const fileMetadataMacros: MacroMap =
    fileMetadata?.macros && fileMetadata?.macros.length > 0
      ? fileMetadata?.macros[0]
      : {};

  const selectedMacros =
    overrideMacros && Object.entries(overrideMacros).length > 0
      ? overrideMacros
      : fileMetadataMacros;

  const beamlineUrlId = `/synoptic/${selectedBeamlineId}`;

  const urlPath = path
    ? "/quick-screens"
    : fileMetadata?.urlId
      ? `${beamlineUrlId}/${fileMetadata.urlId}`
      : beamlineUrlId;

  const protocol = "ca";

  executeOpenPageAction(
    newScreen,
    selectedMacros,
    protocol,
    fileContext,
    urlPath,
    beamlineState.pvwsHost,
    path,
    replace
  );
};

export const executeOpenPageAction = (
  screenFileUrl: string,
  macros: MacroMap,
  protocol: string,
  fileContext: any,
  browserUrl: string,
  pvwsHost?: string,
  path?: string,
  replace?: boolean
) => {
  executeAction(
    {
      type: "OPEN_PAGE",
      dynamicInfo: {
        name: screenFileUrl,
        location: path || "main",
        description: undefined,
        pvwsHost,
        file: {
          path: screenFileUrl,
          macros: macros,
          defaultProtocol: protocol
        }
      }
    },
    fileContext,
    undefined,
    {},
    browserUrl,
    replace
  );
};

export const executeOpenQuickScreen = (
  name: string,
  location: string,
  macros: MacroMap,
  fileContext: any,
  pvwsHost?: string
) => {
  executeAction(
    {
      type: "OPEN_PAGE",
      dynamicInfo: {
        name,
        location: location,
        description: undefined,
        pvwsHost,
        file: {
          path: name,
          macros: macros,
          defaultProtocol: "ca"
        }
      }
    },
    fileContext,
    undefined,
    {},
    "/quick-screens",
    true
  );
};

export const executeCloseQuickScreen = (
  name: string,
  location: string,
  macros: MacroMap,
  fileContext: any
) => {
  executeAction(
    {
      type: "CLOSE_PAGE",
      dynamicInfo: {
        name,
        location: location,
        file: {
          path: name,
          macros: macros,
          defaultProtocol: "ca"
        }
      }
    },
    fileContext,
    undefined,
    {},
    "/quick-screens",
    true
  );
};
