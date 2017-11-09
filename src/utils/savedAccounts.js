export const getSavedAccounts = () => {
  const savedAccounts = localStorage.getItem('accounts');
  if (savedAccounts) {
    const accounts = JSON.parse(savedAccounts);
    if (accounts instanceof Array) {
      return accounts;
    }
  }
  return [];
};

export const getLastActiveAccount = () => (
  getSavedAccounts()[localStorage.getItem('lastActiveAccountIndex') || 0]
);

export const setLastActiveAccount = ({ publicKey, network, address }) => {
  const lastActiveAccountIndex = getSavedAccounts().findIndex(account => (
    account.publicKey === publicKey &&
    account.network === network &&
    account.address === address
  ));
  if (lastActiveAccountIndex > -1) {
    localStorage.setItem('lastActiveAccountIndex', lastActiveAccountIndex);
  }
  return lastActiveAccountIndex;
};

export const setSavedAccount = ({ publicKey, network, address }) => {
  const savedAccounts = [
    ...getSavedAccounts(),
    {
      publicKey,
      network,
      address,
    },
  ];
  localStorage.setItem('accounts', JSON.stringify(savedAccounts));
  return savedAccounts;
};

export const removeSavedAccount = ({ network, publicKey }) => {
  const accounts = getSavedAccounts().filter(account =>
    !(account.publicKey === publicKey && account.network === network));
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
