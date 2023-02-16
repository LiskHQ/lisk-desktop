export const getNameFromAccount = (address, settings, deviceId) => {
  const { hardwareAccounts } = settings;

  if (Array.isArray(hardwareAccounts[deviceId])) {
    const storedAccount = hardwareAccounts[deviceId].filter(
      (account) => account.address === address
    );
    return storedAccount.length ? storedAccount[0].name : null;
  }
  return null;
};
