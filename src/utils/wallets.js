import localJSONStorage from './localJSONStorage';

export const setWalletsInLocalStorage = wallets => localJSONStorage.set('wallets', wallets);

export const getWalletsFromLocalStorage = () => localJSONStorage.get('wallets', {});
