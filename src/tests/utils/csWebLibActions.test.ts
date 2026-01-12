import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  executeOpenPageActionWithFileGuid,
  executeOpenPageActionWithUrlId,
  executeOpenPageAction
} from "../../utils/csWebLibActions";
import { executeAction } from "@diamondlightsource/cs-web-lib";
import * as urlUtils from "../../utils/urlUtils";
import { BeamlineStateProperties, FileMetadata } from "../../store";

vi.mock("@diamondlightsource/cs-web-lib", () => ({
  executeAction: vi.fn()
}));

const buildUrlSpy = vi
  .spyOn(urlUtils, "buildUrl")
  .mockImplementation((host, file) => `${host}/${file}`);

describe("executeAction: OPEN_PAGE", () => {
  let mockBeamlineState: BeamlineStateProperties;
  let mockFileContext: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockBeamlineState = {
      host: "http://example.com",
      topLevelScreen: "default-screen",
      filePathIds: {
        "guid-1": {
          file: "screen1.opi",
          urlId: "screen1",
          macros: [{ key1: "value1" }, { key2: "value2" }]
        },
        "guid-2": {
          file: "screen2.opi",
          urlId: "screen2",
          macros: [{ key3: "value3" }]
        },
        "guid-3": {
          file: "index.opi",
          urlId: "index",
          macros: []
        }
      }
    } as Partial<BeamlineStateProperties> as BeamlineStateProperties;

    mockFileContext = { someContext: "value" };
  });

  describe("executeOpenPageActionWithFileGuid", () => {
    it("should call executeOpenPageAction with the correct file metadata based on guid", () => {
      const fileGuid = "guid-1";
      const selectedBeamlineId = "beamline-1";
      const expectedFileMetadata = mockBeamlineState.filePathIds[fileGuid];

      executeOpenPageActionWithFileGuid(
        mockBeamlineState,
        fileGuid,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        expectedFileMetadata.file
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "OPEN_PAGE",
          dynamicInfo: expect.objectContaining({
            file: expect.objectContaining({
              macros: { key1: "value1", key2: "value2" }
            })
          })
        }),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/screen1`
      );
    });
  });

  describe("executeOpenPageActionWithUrlId", () => {
    it("should find file metadata by urlId and call executeOpenPageAction", () => {
      const urlId = "screen2";
      const selectedBeamlineId = "beamline-1";
      const expectedFileMetadata = mockBeamlineState.filePathIds["guid-2"];

      executeOpenPageActionWithUrlId(
        mockBeamlineState,
        urlId,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        expectedFileMetadata.file
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "OPEN_PAGE",
          dynamicInfo: expect.objectContaining({
            file: expect.objectContaining({
              macros: { key3: "value3" }
            })
          })
        }),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/screen2`
      );
    });

    it('should default to "index" when urlId is undefined', () => {
      const urlId = undefined;
      const selectedBeamlineId = "beamline-1";
      const expectedFileMetadata = mockBeamlineState.filePathIds["guid-3"]; // The one with urlId 'index'

      executeOpenPageActionWithUrlId(
        mockBeamlineState,
        urlId,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        expectedFileMetadata.file
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.anything(),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/index`
      );
    });

    it("should handle when no matching file metadata is found", () => {
      const urlId = "non-existent";
      const selectedBeamlineId = "beamline-1";

      executeOpenPageActionWithUrlId(
        mockBeamlineState,
        urlId,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        mockBeamlineState.topLevelScreen
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "OPEN_PAGE",
          dynamicInfo: expect.objectContaining({
            file: expect.objectContaining({
              macros: {}
            })
          })
        }),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}`
      );
    });
  });

  describe("executeOpenPageAction", () => {
    it("should call executeAction with correct parameters including macros when fileMetadata is provided", () => {
      const fileMetadata: FileMetadata = {
        file: "test-screen.opi",
        urlId: "test-screen",
        macros: [{ param1: "value1" }, { param2: "value2", param3: "value3" }]
      };
      const selectedBeamlineId = "beamline-1";
      const expectedUrl = `${mockBeamlineState.host}/${fileMetadata.file}`;

      executeOpenPageAction(
        mockBeamlineState,
        fileMetadata,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        fileMetadata.file
      );

      expect(executeAction).toHaveBeenCalledWith(
        {
          type: "OPEN_PAGE",
          dynamicInfo: {
            name: expectedUrl,
            location: "main",
            description: undefined,
            file: {
              path: expectedUrl,
              macros: { param1: "value1", param2: "value2", param3: "value3" },
              defaultProtocol: "ca"
            }
          }
        },
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/test-screen`
      );
    });

    it("should use topLevelScreen when fileMetadata is undefined", () => {
      const fileMetadata = undefined;
      const selectedBeamlineId = "beamline-1";
      const expectedUrl = `${mockBeamlineState.host}/${mockBeamlineState.topLevelScreen}`;

      executeOpenPageAction(
        mockBeamlineState,
        fileMetadata,
        selectedBeamlineId,
        mockFileContext
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(
        mockBeamlineState.host,
        mockBeamlineState.topLevelScreen
      );

      expect(executeAction).toHaveBeenCalledWith(
        {
          type: "OPEN_PAGE",
          dynamicInfo: {
            name: expectedUrl,
            location: "main",
            description: undefined,
            file: {
              path: expectedUrl,
              macros: {},
              defaultProtocol: "ca"
            }
          }
        },
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}`
      );
    });

    it("should handle empty macros array", () => {
      const fileMetadata = {
        file: "test-screen.opi",
        urlId: "test-screen",
        macros: []
      };
      const selectedBeamlineId = "beamline-1";

      executeOpenPageAction(
        mockBeamlineState,
        fileMetadata,
        selectedBeamlineId,
        mockFileContext
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          dynamicInfo: expect.objectContaining({
            file: expect.objectContaining({
              macros: {}
            })
          })
        }),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/test-screen`
      );
    });

    it("should handle undefined macros", () => {
      const fileMetadata = {
        file: "test-screen.opi",
        urlId: "test-screen"
      };
      const selectedBeamlineId = "beamline-1";

      executeOpenPageAction(
        mockBeamlineState,
        fileMetadata,
        selectedBeamlineId,
        mockFileContext
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.objectContaining({
          dynamicInfo: expect.objectContaining({
            file: expect.objectContaining({
              macros: {}
            })
          })
        }),
        mockFileContext,
        undefined,
        {},
        `/synoptic/${selectedBeamlineId}/test-screen`
      );
    });

    it("should use beamlineUrlId when fileMetadata.urlId is undefined", () => {
      const fileMetadata: FileMetadata = {
        file: "test-screen.opi",
        macros: [],
        urlId: undefined
      };
      const selectedBeamlineId = "beamline-1";
      const expectedUrlPath = `/synoptic/${selectedBeamlineId}`;

      executeOpenPageAction(
        mockBeamlineState,
        fileMetadata,
        selectedBeamlineId,
        mockFileContext
      );

      expect(executeAction).toHaveBeenCalledWith(
        expect.anything(),
        mockFileContext,
        undefined,
        {},
        expectedUrlPath
      );
    });
  });
});
