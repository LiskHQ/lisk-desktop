const selectAccount = state => state.wallet;
const selectActiveToken = state => state.token.active;
const selectAddress = state => state.wallet.info[state.token.active].address;
const selectLSKAddress = state =>
  (state.wallet.info ? state.wallet.info.LSK.summary.address : undefined);
const selectBTCAddress = state =>
  (state.wallet.info ? state.wallet.info.BTC.summary.address : undefined);
const selectPublicKey = state => state.wallet.info[state.token.active].publicKey;
const selectTransactions = state => state.transactions;
const selectActiveTokenAccount = (state) => {
  if (!state.wallet.info) {
    return {};
  }
  return {
    ...state.wallet.info[state.token.active],
    passphrase: state.passphrase,
    hwInfo: state.hwInfo,
  };
};
const selectAccountBalance = state => (
  state.wallet.info ? state.wallet.info[state.token.active].summary.balance : undefined);
const selectBookmarks = state => state.bookmarks[state.token.active];
const selectBookmark = (state, address) =>
  state.bookmarks[state.token.active].find(item => (item.address === address));
const selectSettings = state => state.settings;
const selectServiceUrl = state => state.network.networks?.LSK?.serviceUrl;
const selectNetworkIdentifier = state => state.network.networks?.LSK?.networkIdentifier;
const selectNetworkName = state => state.network.name;
const selectCurrentBlockHeight = state => state.blocks.latestBlocks[0]?.height || 0;
const selectActiveTokenNetwork = state => state.network.networks[state.token.active];

export {
  selectBookmark,
  selectSettings,
  selectActiveToken,
  selectTransactions,
  selectBookmarks,
  selectAddress,
  selectAccount,
  selectLSKAddress,
  selectBTCAddress,
  selectPublicKey,
  selectActiveTokenAccount,
  selectAccountBalance,
  selectServiceUrl,
  selectCurrentBlockHeight,
  selectNetworkIdentifier,
  selectNetworkName,
  selectActiveTokenNetwork,
};
