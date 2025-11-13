import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadConfig, DaedalusConfig, resetConfig } from '../config';

const buildMockConfig = (): DaedalusConfig => ({
    PVWS_SOCKET: 'ws://pvws.example.org',
    PVWS_SSL: false,
    THROTTLE_PERIOD: 100,
    beamlines: {
    B23: {
        host: 'B23.example.org',
        entryPoint: '/test/path'
    }
  }
});

describe('Configuration Module', () => {
  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  describe('loadConfig', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        vi.resetModules();
        resetConfig();
    });

    it('should load configuration from fetch', async () => {
        const mockConfig: DaedalusConfig = buildMockConfig();

        mockFetch.mockResolvedValueOnce({
        json: async () => mockConfig
        });

        const result = await loadConfig();

        expect(mockFetch).toHaveBeenCalledWith('/config/config.json');
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockConfig);
    });

    it('should return cached configuration on second call', async () => {
        const mockConfig = buildMockConfig();
        
        mockFetch.mockResolvedValueOnce({
        json: async () => mockConfig
        });
        
        const result1 = await loadConfig();
        const result2 = await loadConfig();
        
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(result1).toEqual(mockConfig);
        expect(result2).toEqual(mockConfig);
        expect(result1).toBe(result2);
    });

    it('should use default configuration on fail to get config file', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        const result = await loadConfig();
        
        expect(mockFetch).toHaveBeenCalledWith('/config/config.json');
        expect(result).toEqual({
        PVWS_SOCKET: undefined,
        PVWS_SSL: undefined,
        THROTTLE_PERIOD: undefined,
        beamlines: {}
        });
    });

    it('should use default configuration on JSON parsing error', async () => {
        mockFetch.mockResolvedValueOnce({
        json: async () => { throw new Error('Invalid JSON'); }
        });
        
        const result = await loadConfig();
        
        expect(result).toEqual({
        PVWS_SOCKET: undefined,
        PVWS_SSL: undefined,
        THROTTLE_PERIOD: undefined,
        beamlines: {}
        });
    });
  });
});
