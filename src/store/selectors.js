const selectAccount = state => state.account;
const selectActiveToken = state => state.settings.token.active;
const selectAddress = state => state.account.info[state.settings.token.active].address;
const selectLSKAddress = state => state.account.info.LSK.address;
const selectBTCAddress = state => state.account.info.BTC.address;
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
};
