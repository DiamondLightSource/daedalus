import { describe, it, expect, vi, beforeEach } from "vitest";

const mockHttpRequest = vi.fn();
vi.mock("@diamondlightsource/cs-web-lib", () => ({
  httpRequest: (...args: any[]) => mockHttpRequest(...args)
}));

vi.mock("react-toastify", () => ({}));
import {
  loadConfig,
  DaedalusConfig,
  resetConfig,
  BeamlinesConfig
} from "../config";

const buildMockConfig = (): DaedalusConfig =>
  ({
    PVWS_SOCKET: "ws://pvws.example.org",
    PVWS_SSL: false,
    THROTTLE_PERIOD: 100,
    beamlines: {
      B23: {
        host: "B23.example.org",
        entryPoint: "/test/path",
        pvwsHost: "http://diamond.ac.uk/host",
        mjpgEndpoint: undefined
      }
    } as Partial<BeamlinesConfig>
  }) as Partial<DaedalusConfig> as DaedalusConfig;

describe("Configuration Module", () => {
  describe("loadConfig", () => {
    beforeEach(() => {
      vi.resetAllMocks();
      vi.resetModules();
      resetConfig();
    });

    it("should load configuration from fetch", async () => {
      const mockConfig: DaedalusConfig = buildMockConfig();

      mockHttpRequest.mockResolvedValueOnce({
        json: async () => mockConfig
      });

      const result = await loadConfig();

      expect(mockHttpRequest).toHaveBeenCalledWith("/config/config.json");
      expect(mockHttpRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockConfig);
    });

    it("should return cached configuration on second call", async () => {
      const mockConfig = buildMockConfig();

      mockHttpRequest.mockResolvedValueOnce({
        json: async () => mockConfig
      });

      const result1 = await loadConfig();
      const result2 = await loadConfig();

      expect(mockHttpRequest).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(mockConfig);
      expect(result2).toEqual(mockConfig);
      expect(result1).toBe(result2);
    });

    it("should use default configuration on fail to get config file", async () => {
      mockHttpRequest.mockRejectedValueOnce(new Error("Network error"));

      const result = await loadConfig();

      expect(mockHttpRequest).toHaveBeenCalledWith("/config/config.json");
      expect(result).toEqual({
        PVWS_SOCKET: undefined,
        PVWS_SSL: undefined,
        THROTTLE_PERIOD: undefined,
        beamlines: {},
        csWebLibFeatureFlags: {
          enableDynamicScripts: false
        },
        defaultMjpgEndpoint: undefined,
        storeMode: undefined
      });
    });

    it("should use default configuration on JSON parsing error", async () => {
      mockHttpRequest.mockResolvedValueOnce({
        json: async () => {
          throw new Error("Invalid JSON");
        }
      });

      const result = await loadConfig();

      expect(result).toEqual({
        PVWS_SOCKET: undefined,
        PVWS_SSL: undefined,
        THROTTLE_PERIOD: undefined,
        beamlines: {},
        csWebLibFeatureFlags: {
          enableDynamicScripts: false
        },
        defaultMjpgEndpoint: undefined,
        storeMode: undefined
      });
    });
  });
});
