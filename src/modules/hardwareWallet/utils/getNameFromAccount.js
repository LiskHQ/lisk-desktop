export const getNameFromAccount = (address, settings, model) => {
  const { hardwareAccounts } = settings;
  const accounts = hardwareAccounts[model];
  if (Array.isArray(accounts)) {
    const { name } = accounts.find((account) => account.address === address);
    return name;
  }
  return null;
};
