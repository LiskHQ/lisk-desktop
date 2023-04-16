export const getNameFromAccount = (address, hwAccounts) => {
  try {
    const { name } = hwAccounts.find((account) => account.metadata?.address === address);
    return name;
  } catch (e) {
    return null;
  }
};
