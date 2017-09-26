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

export const removeSavedAccount = () => {
  localStorage.removeItem('accounts');
};
