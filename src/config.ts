import { CsWebLibConfig } from "@diamondlightsource/cs-web-lib";

export const loadConfig = async (): Promise<CsWebLibConfig> => {
  try {
    const response = await fetch('/config/config.json');
    return await response.json();
  } catch {
    console.log("Configuration not found falling back to defaults");

    const emptyConfig: CsWebLibConfig = {
      PVWS_SOCKET: undefined,
      PVWS_SSL: undefined,
      THROTTLE_PERIOD: undefined
    };

    return new Promise((resolve) => { resolve(emptyConfig) });
  }
}
