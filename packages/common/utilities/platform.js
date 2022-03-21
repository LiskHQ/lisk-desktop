import { isBrowser } from 'browser-or-node';
import isElectron from 'is-electron';

export const PLATFORM_TYPES = {
  ELECTRON: 0,
  BROWSER: 1,
  OTHER: 3,
};

export const getPlatformType = () => {
  if (isElectron()) {
    return PLATFORM_TYPES.ELECTRON;
  }
  if (isBrowser) {
    return PLATFORM_TYPES.BROWSER;
  }
  return PLATFORM_TYPES.OTHER;
};
