/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import loginTypes from '@wallet/configuration/loginTypes';
import { tokenMap } from '@token/configuration/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { toRawLsk } from '@token/utilities/lsk';
import { isEmpty } from '@common/utilities/helpers';
import { create } from '@transaction/utils/api';
import { selectCurrentBlockHeight } from '@common/store/selectors';
import { getAccount, extractAddress as extractBitcoinAddress } from '@wallet/utilities/api';
import { getConnectionErrorMessage } from '@network/utilities/getNetwork';
import { extractKeyPair, getUnlockableUnlockObjects } from '@wallet/utilities/account';
import { defaultDerivationPath } from '@common/utilities/explicitBipKeyDerivation';
import { networkStatusUpdated } from '@network/store/action';
import actionTypes from './actionTypes';

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
export const accountLoggedOut = () => ({
  type: actionTypes.accountLoggedOut,
});

/**
 * Fires an action to reset the account automatic sign out timer
 * @param {Date} date - Current date
 */
export const timerReset = () => ({
  type: actionTypes.timerReset,
  data: new Date(),
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

/**
 * Gets the account info for given addresses of different tokens
 * We have getAccounts functions for retrieving multiple accounts of
 * a single blockchain. This one is for retrieving accounts of
 * different blockchains.
 *
 * @param {Object} data
 * @param {Object} data.network Network config from the Redux store
 * @param {Object} data.params addresses in the form of {[token]: [address]}
 * @returns {Promise<[object]>}
 */
const getAccounts = async ({ network, params }) =>
  Object.keys(params).reduce(async (accountsPromise, token) => {
    const accounts = await accountsPromise;
    const baseUrl = network.networks[token].serviceUrl;
    const account = await getAccount({ network, baseUrl, params: params[token] }, token);
    return {
      ...accounts,
      [token]: account,
    };
  }, Promise.resolve({}));

/**
 * This action is used to update account balance when new block was forged and
 * account middleware detected that it contains a transaction that affects balance
 * of the active account
 *
 * @param {String} tokensTypes - Options of 'enabled' and 'active'
 */
export const accountDataUpdated = tokensTypes =>
  async (dispatch, getState) => {
    const { network, settings, wallet } = getState();

    // Get the list of tokens that are enabled in settings
    const activeTokens = tokensTypes === 'enabled'
      ? Object.keys(settings.token.list)
        .filter(key => settings.token.list[key])
      : [settings.token.active];

    // Collect their addresses to send to the API
    const params = activeTokens.reduce((acc, token) => {
      acc[token] = { publicKey: wallet.info[token].summary.publicKey };
      return acc;
    }, {});

    const [error, info] = await to(getAccounts({ network, params }));

    if (info) {
      // Uninitialized account don't have a public key stored on the blockchain.
      // but we already have it on the Redux store.
      info.LSK.summary.publicKey = wallet.info.LSK.summary.publicKey;
      info.LSK.summary.privateKey = wallet.info.LSK.summary.privateKey;
      dispatch({
        type: actionTypes.accountUpdated,
        data: info,
      });
      dispatch(networkStatusUpdated({ online: true }));
    } else {
      dispatch(networkStatusUpdated({ online: false, code: error.error.code }));
    }
  };

/**
 * This action is used on login to fetch account info for all enabled token
 *
 * @param {Object} data - for hardware wallets it contains publicKey and hwInfo,
 *    otherwise contains passphrase
 * @param {String} data.passphrase - BIP39 passphrase of the account
 * @param {String} data.publicKey - Lisk publicKey used for hardware wallet login
 * @param {Object} data.hwInfo - info about hardware wallet we're trying to login to
 */
export const login = ({
  passphrase, publicKey, hwInfo,
}) =>
  async (dispatch, getState) => {
    const { network, settings } = getState();
    const { enableCustomDerivationPath, customDerivationPath } = settings;
    dispatch(accountLoading());

    const params = Object.keys(settings.token.list)
      .filter(key => settings.token.list[key])
      .reduce((acc, token) => {
        if (token === tokenMap.BTC.key) {
          acc[token] = {
            address: extractBitcoinAddress(passphrase, network),
          };
        } else {
          let keyPair = {};
          if (passphrase) {
            keyPair = extractKeyPair({
              passphrase,
              enableCustomDerivationPath,
              derivationPath: customDerivationPath || defaultDerivationPath,
            });
          } else if (publicKey) {
            keyPair.publicKey = publicKey;
          }
          acc[token] = {
            ...keyPair,
          };
        }
        return acc;
      }, {});

    const [error, info] = await to(getAccounts({ network, params }));

    if (error) {
      toast.error(getConnectionErrorMessage(error));
      dispatch(accountLoggedOut());
    } else {
      const loginType = hwInfo
        ? ['trezor', 'ledger'].find(item => hwInfo.deviceModel.toLowerCase().indexOf(item) > -1)
        : 'passphrase';
      dispatch({
        type: actionTypes.accountLoggedIn,
        data: {
          passphrase,
          loginType: loginTypes[loginType].code,
          hwInfo: hwInfo || {},
          date: new Date(),
          info,
        },
      });
    }
  };

/**
 * Store second passphrase in the Redux store
 *
 * @param {string} passphrase - Valid Mnemonic passphrase
 * @returns {object} Pure action object
 */
export const secondPassphraseStored = (passphrase) => ({
  type: actionTypes.secondPassphraseStored,
  data: passphrase,
});

/**
 * Removes the second passphrase from the Redux store
 *
 * @returns {object} Pure action object
 */
export const secondPassphraseRemoved = () => ({
  type: actionTypes.secondPassphraseRemoved,
});

/**
 * Submits unlock balance transactions
 *
 * @param {object} data
 * @param {string} data.selectedFee
 * @returns {promise}
 */
export const balanceUnlocked = data => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const currentBlockHeight = selectCurrentBlockHeight(state);
  // @todo Fix this by #3898
  const activeWallet = {
    ...state.wallet.info.LSK,
    hwInfo: isEmpty(state.wallet.hwInfo) ? undefined : state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
        senderPublicKey: activeWallet.summary.publicKey,
        nonce: activeWallet.sequence?.nonce,
        fee: `${toRawLsk(parseFloat(data.selectedFee))}`,
        unlockObjects: getUnlockableUnlockObjects(
          activeWallet.dpos?.unlocking, currentBlockHeight,
        ),
      },
    }, tokenMap.LSK.key),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};

export const delegateRegistered = ({ fee, username }) => async (dispatch, getState) => {
//
  // Collect data
  //
  const state = getState();
  const activeWallet = {
    ...state.wallet.info.LSK,
    hwInfo: isEmpty(state.wallet.hwInfo) ? undefined : state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        senderPublicKey: activeWallet.summary.publicKey,
        nonce: activeWallet.sequence?.nonce,
        fee: toRawLsk(parseFloat(fee.value)),
        username,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
      },
    }, tokenMap.LSK.key),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};

export const multisigGroupRegistered = ({
  fee,
  mandatoryKeys,
  optionalKeys,
  numberOfSignatures,
}) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = {
    ...state.wallet.info.LSK,
    hwInfo: isEmpty(state.wallet.hwInfo) ? undefined : state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        mandatoryKeys,
        optionalKeys,
        numberOfSignatures,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup,
        fee: toRawLsk(fee),
        nonce: activeWallet.sequence.nonce,
        senderPublicKey: activeWallet.summary.publicKey,
      },
    }, tokenMap.LSK.key),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};

export const balanceReclaimed = ({ fee }) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = {
    ...state.wallet.info.LSK,
    hwInfo: isEmpty(state.wallet.hwInfo) ? undefined : state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
        fee: toRawLsk(fee.value),
        amount: activeWallet.legacy.balance,
        keys: { numberOfSignatures: 0 },
      },
    }, tokenMap.LSK.key),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};
