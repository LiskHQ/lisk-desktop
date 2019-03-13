import localJSONStorage from './localJSONStorage';

export const getWalletsFromLocalStorage = () => localJSONStorage.get('wallets', {});

export const setWalletsInLocalStorage = wallets => localJSONStorage.set('wallets', {
  ...getWalletsFromLocalStorage(),
  ...wallets,
});
