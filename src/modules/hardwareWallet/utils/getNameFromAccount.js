export const getNameFromAccount = (address, hwAccounts) => {
  try {
    const hwAccount = hwAccounts.find((account) => account.metadata?.address === address);
    return hwAccount.metadata.name;
  } catch (e) {
    return null;
  }
};
