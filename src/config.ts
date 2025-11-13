import { CsWebLibConfig } from "@diamondlightsource/cs-web-lib";

export type BeamlinesConfig = {
  [beamline: string]: {
    host: string,
    entryPoint: string,
  }
};

export type DaedalusConfig = CsWebLibConfig & {
  beamlines?: BeamlinesConfig
}

let config: DaedalusConfig | null = null;

export const loadConfig = async (): Promise<DaedalusConfig> => {
  if (config) {
    return config;
  }

  try {
    const response = await fetch('/config/config.json');
    config = await response.json();
  } catch(error) {
    console.warn("Configuration not found falling back to defaults", error);
    config = {
      PVWS_SOCKET: undefined,
      PVWS_SSL: undefined,
      THROTTLE_PERIOD: undefined,
      beamlines: {},
    };
  }

  return config as DaedalusConfig;;
}

export const resetConfig = () => {
  // This is to aid testing.
  config = null;
}