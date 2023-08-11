const selectActiveToken = (state) => state.token.active;
const selectLSKAddress = (state) =>
  state.wallet.info ? state.wallet.info.LSK.summary.address : undefined;
const selectTransactions = (state) => state.transactions;
const selectActiveTokenAccount = (state) => {
  if (!state.wallet.info) {
    return {};
  }
  return {
    ...state.wallet.info[state.token.active],
    loginType: state.wallet.loginType,
  };
};
const selectAccountBalance = (
  state // @todo account has multiple balance now
) => (state.wallet.info ? state.wallet.info[state.token.active].summary.balance : undefined);
const selectSettings = (state) => state.settings;
const selectNetwork = (state) => state.settings.network;
const selectNetworkName = (state) => state.settings.network.name;
const selectStaking = (state) => state.staking;
const selectBookmarks = (state) => state.bookmarks;

export {
  selectStaking,
  selectNetwork,
  selectSettings,
  selectActiveToken,
  selectTransactions,
  selectLSKAddress,
  selectActiveTokenAccount,
  selectAccountBalance,
  selectNetworkName,
  selectBookmarks,
};
