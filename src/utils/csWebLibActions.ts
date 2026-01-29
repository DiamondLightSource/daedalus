import { buildUrl, executeAction } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties, FileMetadata, MacroMap } from "../store";

export const executeOpenPageActionWithFileGuid = (
  beamlineState: BeamlineStateProperties,
  fileGuid: string,
  selectedBeamlineId: string,
  fileContext: any
) => {
  const fileMetadata = beamlineState.filePathIds[fileGuid];
  executeOpenPageActionWithFileMetadata(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext
  );
};

export const executeOpenPageActionWithUrlId = (
  beamlineState: BeamlineStateProperties,
  urlId: string | undefined,
  selectedBeamlineId: string,
  fileContext: any,
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
    extraMacros
  );
};

export const executeOpenPageActionWithFileMetadata = (
  beamlineState: BeamlineStateProperties,
  fileMetadata: FileMetadata | undefined,
  selectedBeamlineId: string,
  fileContext: any,
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

  const urlPath = fileMetadata?.urlId
    ? `${beamlineUrlId}/${fileMetadata.urlId}`
    : beamlineUrlId;

  const protocol = "ca";

  executeOpenPageAction(
    newScreen,
    selectedMacros,
    protocol,
    fileContext,
    urlPath
  );
};

export const executeOpenPageAction = (
  screenFileUrl: string,
  macros: MacroMap,
  protocol: string,
  fileContext: any,
  browserUrl: string
) => {
  executeAction(
    {
      type: "OPEN_PAGE",
      dynamicInfo: {
        name: screenFileUrl,
        location: "main",
        description: undefined,
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
