import { selectCurrentHWDevice } from '@hardwareWallet/store/selectors/hwSelectors';

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

const selectCurrentAccountWithSigningData = (state) => {
  if (state.account?.current?.hw) {
    const currentHWDevice = selectCurrentHWDevice(state);
    const accountWithUpdatedHw = {
      ...state.account?.current,
      hw: {
        ...currentHWDevice,
      },
    };
    return accountWithUpdatedHw;
  }

  return selectActiveTokenAccount(state);
};

const selectAccountBalance = (
  state // @todo account has multiple balance now
) => (state.wallet.info ? state.wallet.info[state.token.active].summary.balance : undefined);
const selectSettings = (state) => state.settings;
const selectNetwork = (state) => state.network;
const selectNetworkName = (state) => state.network.name;
const selectStaking = (state) => state.staking;
const selectModuleCommandSchemas = (state) => state.network.networks?.LSK?.moduleCommandSchemas;
const selectBookmarks = (state) => state.bookmarks;
const selectCurrentBlockchainApplication = (state) => state.blockChainApplications.current;

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
  selectModuleCommandSchemas,
  selectBookmarks,
  selectCurrentBlockchainApplication,
  selectCurrentAccountWithSigningData
};
