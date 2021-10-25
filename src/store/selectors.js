const selectAccount = state => state.account;
const selectActiveToken = state => state.settings.token.active;
const selectAddress = state => state.account.info[state.settings.token.active].address;
const selectLSKAddress = state =>
  (state.account.info ? state.account.info.LSK.summary.address : undefined);
const selectBTCAddress = state =>
  (state.account.info ? state.account.info.BTC.summary.address : undefined);
const selectPublicKey = state => state.account.info[state.settings.token.active].publicKey;
const selectTransactions = state => state.transactions;
const selectActiveTokenAccount = state => state.account.info[state.settings.token.active];
const selectAccountBalance = state =>
  state.account.info[state.settings.token.active].summary.balance;
const selectBookmarks = state => state.bookmarks[state.settings.token.active];
const selectBookmark = (state, address) =>
  state.bookmarks[state.settings.token.active].find(item => (item.address === address));
const selectSettings = state => state.settings;
const selectServiceUrl = state => state.network.networks?.LSK?.serviceUrl;
const selectNetworkIdentifier = state => state.network.networks?.LSK?.networkIdentifier;
const selectCurrentBlockHeight = state => state.blocks.latestBlocks[0]?.height || 0;
const selectActiveTokenNetwork = state => state.network.networks[state.settings.token.active];

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
  selectActiveTokenNetwork,
};
