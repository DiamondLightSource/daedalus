import { executeAction } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties, FileMetadata, MacroMap } from "../store";
import { buildUrl } from "./urlUtils";

export const executeOpenPageActionWithFileGuid = (
  beamlineState: BeamlineStateProperties,
  fileGuid: string,
  selectedBeamlineId: string,
  fileContext: any
) => {
  const fileMetadata = beamlineState.filePathIds[fileGuid];
  executeOpenPageAction(
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
  fileContext: any
) => {
  const fileMetadata = Object.values(beamlineState.filePathIds).find(
    x => x.urlId === (urlId ?? "index")
  );

  executeOpenPageAction(
    beamlineState,
    fileMetadata,
    selectedBeamlineId,
    fileContext
  );
};

export const executeOpenPageAction = (
  beamlineState: BeamlineStateProperties,
  fileMetadata: FileMetadata | undefined,
  selectedBeamlineId: string,
  fileContext: any
) => {
  const newScreen = buildUrl(
    beamlineState.host,
    fileMetadata?.file ?? beamlineState.topLevelScreen
  );

  const macros: MacroMap =
    fileMetadata?.macros?.reduce((acc, obj) => Object.assign(acc, obj), {}) ??
    {};
  const beamlineUrlId = `/synoptic/${selectedBeamlineId}`;

  const urlPath = fileMetadata?.urlId
    ? `${beamlineUrlId}/${fileMetadata.urlId}`
    : beamlineUrlId;

  executeAction(
    {
      type: "OPEN_PAGE",
      dynamicInfo: {
        name: newScreen,
        location: "main",
        description: undefined,
        file: {
          path: newScreen,
          macros: macros,
          defaultProtocol: "ca"
        }
      }
    },
    fileContext,
    undefined,
    {},
    urlPath
  );
};
