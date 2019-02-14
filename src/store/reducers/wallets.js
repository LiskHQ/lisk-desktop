import actionTypes from '../../constants/actions';
import { getWalletsFromLocalStorage } from '../../utils/wallets';

// eslint-disable-next-line max-statements
const wallets = (state = {}, action) => {
  const allWallets = {
    ...getWalletsFromLocalStorage(),
    ...state,
  };
  switch (action.type) {
    case actionTypes.walletsCleared:
      return {};
    case actionTypes.walletDeleted: {
      const { [action.address]: removed, ...rest } = allWallets;
      return rest;
    }
    case actionTypes.setWalletsLastBalance: {
      const addresses = Object.keys(allWallets);
      const newState = addresses.reduce((acc, address) => ({
        ...acc,
        [address]: {
          ...action.data[address],
          lastBalance: action.data[address].balance,
        },
      }), {});
      return newState;
    }
    case actionTypes.walletUpdated: {
      const wallet = allWallets[action.data.address] || {};
      const lastBalance = wallet.lastBalance || action.data.balance;
      return {
        ...allWallets,
        [action.data.address]: {
          ...wallet,
          lastBalance,
          balance: action.data.balance,
        },
      };
    }
    default:
      return allWallets;
  }
};

export default wallets;
