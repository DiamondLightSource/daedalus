import { buildUrl, executeAction } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties, FileMetadata, MacroMap } from "../store";

export const executeOpenPageActionWithFileGuid = (
  beamlineState: BeamlineStateProperties,
  fileGuid: string,
  selectedBeamlineId: string,
  fileContext: any,
  page?: string
) => {
  const fileMetadata = beamlineState.filePathIds[fileGuid];
  executeOpenPageActionWithFileMetadata(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext,
    page
  );
};

export const executeOpenPageActionWithUrlId = (
  beamlineState: BeamlineStateProperties,
  urlId: string | undefined,
  selectedBeamlineId: string,
  fileContext: any,
  page?: string,
  extraMacros?: MacroMap
) => {
  const fileMetadata = Object.values(beamlineState.filePathIds).find(
    x => x.urlId === (urlId ?? "index")
  );

  executeOpenPageActionWithFileMetadata(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext,
    page,
    extraMacros
  );
};

export const executeOpenPageActionWithFileMetadata = (
  beamlineState: BeamlineStateProperties,
  fileMetadata: FileMetadata | undefined,
  selectedBeamlineId: string,
  fileContext: any,
  page?: string,
  overrideMacros?: MacroMap
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

  const urlPath = page
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
    page,
    beamlineState.pvwsHost
  );
};

export const executeOpenPageAction = (
  screenFileUrl: string,
  macros: MacroMap,
  protocol: string,
  fileContext: any,
  browserUrl: string,
  page?: string,
  pvwsHost?: string
) => {
  executeAction(
    {
      type: "OPEN_PAGE",
      dynamicInfo: {
        name: screenFileUrl,
        location: page || "main",
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
    browserUrl
  );
};
