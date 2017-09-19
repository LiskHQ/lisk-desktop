export const getSavedAccount = () => {
  const savedAccounts = localStorage.getItem('accounts');
  let account;
  if (savedAccounts) {
    account = JSON.parse(savedAccounts)[0];
  }
  return account;
};

export const setSavedAccount = (account) => {
  localStorage.setItem('accounts', JSON.stringify([{
    publicKey: account.publicKey,
    network: localStorage.getItem('network'),
    address: localStorage.getItem('address'),
  }]));
};

export const removeSavedAccount = () => {
  localStorage.removeItem('accounts');
};
