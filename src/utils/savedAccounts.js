import { validateUrl } from './login';
import { extractAddress } from './account';

const isValidSavedAccount = ({ publicKey, network, address }) => {
  try {
    return extractAddress(publicKey) &&
      network >= 0 && network <= 2 &&
      (validateUrl(address).addressValidity === '' || network !== 2);
  } catch (e) {
    return false;
  }
};

export const getSavedAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem('accounts')).filter(isValidSavedAccount);
  } catch (e) {
    return [];
  }
};

export const setSavedAccounts = (accounts) => {
  accounts = accounts.map(({
    publicKey, network, address, balance,
  }) => ({
    publicKey, network, address, balance,
  }));
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

export const getLastActiveAccount = () => (getSavedAccounts()[localStorage.getItem('lastActiveAccountIndex')] || getSavedAccounts()[0]);

export const getIndexOfSavedAccount = (savedAccounts, { publicKey, network, address }) =>
  savedAccounts.findIndex(account => (
    account.publicKey === publicKey &&
    account.network === network &&
    account.address === address
  ));

export const setLastActiveAccount = ({ publicKey, network, address }) => {
  const lastActiveAccountIndex = getIndexOfSavedAccount(
    getSavedAccounts(),
    { publicKey, network, address },
  );

  if (lastActiveAccountIndex > -1) {
    localStorage.setItem('lastActiveAccountIndex', lastActiveAccountIndex);
  }
};
