import actionTypes from '../constants/actions';
import { getNetworkIdentifier } from '../utils/getNetwork';
import { getWalletsFromLocalStorage } from '../utils/wallets';

window.getWalletsFromLocalStorage = getWalletsFromLocalStorage;

export const updateWallet = (account, peers) => {
  const networkIdentifier = getNetworkIdentifier(peers);
  const wallets = getWalletsFromLocalStorage();
  const networkWallets = wallets[networkIdentifier] || {};
  const data = {
    ...wallets,
    [networkIdentifier]: {
      ...networkWallets,
      [account.address]: {
        ...networkWallets[account.address],
        balance: account.balance,
      },
    },
  };

  return ({
    type: actionTypes.walletUpdated,
    data,
  });
};

export const setWalletsLastBalance = () => {
  const wallets = getWalletsFromLocalStorage();
  const data = Object.keys(wallets).reduce((network, identifier) => ({
    ...network,
    [identifier]: {
      ...Object.keys(wallets[identifier]).reduce((addresses, address) => ({
        ...addresses,
        [address]: {
          ...wallets[identifier][address],
          lastBalance: wallets[identifier][address].balance,
        },
      }), {}),
    },
  }), {});

  return ({
    type: actionTypes.walletUpdated,
    data,
  });
};
