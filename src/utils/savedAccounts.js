export const getSavedAccounts = () => {
  const savedAccounts = localStorage.getItem('accounts');
  let accounts = [];
  if (savedAccounts) {
    accounts = JSON.parse(savedAccounts);
  }

  return accounts;
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
};

export const setSavedAccount = ({ publicKey, network, address }) => {
  localStorage.setItem('accounts', JSON.stringify([
    ...getSavedAccounts(),
    {
      publicKey,
      network,
      address,
    },
  ]));
};

export const removeSavedAccount = ({ network, publicKey }) => {
  const accounts = getSavedAccounts().filter(account =>
    !(account.publicKey === publicKey && account.network === network));
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
