export const getNameFromAccount = (address, hwAccounts) => {
  const hwAccount = hwAccounts?.find((account) => account.metadata?.address === address);
  return hwAccount?.metadata?.name;
};
