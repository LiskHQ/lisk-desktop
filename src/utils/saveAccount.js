export const getSavedAccount = () => {
  const savedAccounts = localStorage.getItem('accounts');
  let account;
  if (savedAccounts) {
    account = JSON.parse(savedAccounts);
  }

  return account;
};

export const setSavedAccount = ({ publicKey, network, address }) => {
  localStorage.setItem('accounts', JSON.stringify([{
    publicKey,
    network,
    address,
  }]));
};

export const removeSavedAccount = (publicKey) => {
  let accounts = localStorage.getItem('accounts');
  accounts = JSON.parse(accounts);
  accounts = accounts.filter(account => account.publicKey !== publicKey);
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
