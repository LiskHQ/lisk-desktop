import { setInStorage, getFromStorage } from './localJSONStorage';

export const getWalletsFromLocalStorage = () => getFromStorage('wallets', {});

export const setWalletsInLocalStorage = wallets => setInStorage('wallets', {
  ...getWalletsFromLocalStorage(),
  ...wallets,
});
