export const getNameFromAccount = (address, settings, model) => {
  const { hardwareAccounts } = settings;
  const accounts = hardwareAccounts[model];
  try {
    const { name } = accounts.find((account) => account.address === address);
    return name;
  } catch (e) {
    return null;
  }
};
