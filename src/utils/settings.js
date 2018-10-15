import localJSONStorage from './localJSONStorage';

export const setSettingsInLocalStorage = settings => localJSONStorage.set('settings', settings);

export const getSettingsFromLocalStorage = () => localJSONStorage.get('settings', {});
