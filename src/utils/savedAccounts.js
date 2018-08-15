// import { validatAddress } from './account';

// const isValidSavedAccount = ({ publicKey, network, peerAddress }) => {
//   try {
//     return extractAddress(publicKey) &&
//       network >= 0 && network <= 2 &&
//       (validateUrl(peerAddress).addressValidity === '' || network !== 2);
//   } catch (e) {
//     return false;
//   }
// };

// const fixBackwardsCompatibility = (account) => {
//   // 'address' property was renamed to 'peerAddress' to avoid confusion with account address
//   if (account && account.address) {
//     account.peerAddress = account.address;
//     delete account.address;
//   }
//   return account;
// };

export const getSavedAccounts = () => [];

// eslint-disable-next-line
export const setSavedAccounts = (accounts) => {
  accounts = accounts.map(({
    publicKey, network, balance, peerAddress,
  }) => ({
    publicKey, network, balance, peerAddress,
  }));
};

export const getLastActiveAccount = () => (getSavedAccounts()[localStorage.getItem('lastActiveAccountIndex')] || getSavedAccounts()[0]);

export const getIndexOfSavedAccount = (savedAccounts, { publicKey, network, peerAddress }) =>
  savedAccounts.findIndex(account => (
    account.publicKey === publicKey &&
    account.network === network &&
    account.peerAddress === peerAddress
  ));

export const setLastActiveAccount = ({ publicKey, network, peerAddress }) => {
  const lastActiveAccountIndex = getIndexOfSavedAccount(
    getSavedAccounts(),
    { publicKey, network, peerAddress },
  );

  if (lastActiveAccountIndex > -1) {
    localStorage.setItem('lastActiveAccountIndex', lastActiveAccountIndex);
  }
};
