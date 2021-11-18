/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import {
  MODULE_ASSETS_NAME_ID_MAP,
  loginTypes,
  actionTypes,
  tokenMap,
} from '@constants';
import { toRawLsk } from '@utils/lsk';
import { isEmpty } from '@utils/helpers';
import { create } from '@api/transaction';
import { selectCurrentBlockHeight } from '@store/selectors';
import { getAccount, extractAddress as extractBitcoinAddress } from '@api/account';
import { getConnectionErrorMessage } from '@utils/getNetwork';
import { extractKeyPair, getUnlockableUnlockObjects } from '@utils/account';
import { networkStatusUpdated } from './network';

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
    const { network, settings, account } = getState();

    // Get the list of tokens that are enabled in settings
    const activeTokens = tokensTypes === 'enabled'
      ? Object.keys(settings.token.list)
        .filter(key => settings.token.list[key])
      : [settings.token.active];

    // Collect their addresses to send to the API
    const params = activeTokens.reduce((acc, token) => {
      acc[token] = { address: account.info[token].summary.address };
      return acc;
    }, {});

    const [error, info] = await to(getAccounts({ network, params }));

    if (info) {
      // Uninitialized account don't have a public key stored on the blockchain.
      // but we already have it on the Redux store.
      info.LSK.summary.publicKey = account.info.LSK.summary.publicKey;
      info.LSK.summary.privateKey = account.info.LSK.summary.privateKey;
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
 * @param {boolean} data.isRecoveryPhraseMode - enable custom derivation for HW
 * @param {String} data.derivationPath - custom derivation path for HW
 */
export const login = ({
  passphrase, publicKey, hwInfo, isRecoveryPhraseMode, derivationPath,
}) =>
  async (dispatch, getState) => {
    const { network, settings } = getState();
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
            keyPair = extractKeyPair(
              passphrase, isRecoveryPhraseMode, derivationPath,
            );
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
/* istanbul ignore next */
export const balanceUnlocked = data => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const currentBlockHeight = selectCurrentBlockHeight(state);
  // @todo Fix this by #3898
  const activeAccount = {
    ...state.account.info.LSK,
    hwInfo: isEmpty(state.account.hwInfo) ? undefined : state.account.hwInfo,
    passphrase: state.account.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      account: activeAccount,
      transactionObject: {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.unlockToken,
        senderPublicKey: activeAccount.summary.publicKey,
        nonce: activeAccount.sequence?.nonce,
        fee: `${toRawLsk(parseFloat(data.selectedFee))}`,
        unlockObjects: getUnlockableUnlockObjects(
          activeAccount.dpos?.unlocking, currentBlockHeight,
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

/* istanbul ignore next */
export const delegateRegistered = ({ fee, username }) => async (dispatch, getState) => {
//
  // Collect data
  //
  const state = getState();
  const activeAccount = {
    ...state.account.info.LSK,
    hwInfo: isEmpty(state.account.hwInfo) ? undefined : state.account.hwInfo,
    passphrase: state.account.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      account: activeAccount,
      transactionObject: {
        senderPublicKey: activeAccount.summary.publicKey,
        nonce: activeAccount.sequence?.nonce,
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

/* istanbul ignore next */
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
  const activeAccount = {
    ...state.account.info.LSK,
    hwInfo: isEmpty(state.account.hwInfo) ? undefined : state.account.hwInfo,
    passphrase: state.account.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      account: activeAccount,
      transactionObject: {
        mandatoryKeys,
        optionalKeys,
        numberOfSignatures,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup,
        fee: toRawLsk(fee),
        nonce: activeAccount.sequence.nonce,
        senderPublicKey: activeAccount.summary.publicKey,
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

/* istanbul ignore next */
export const balanceReclaimed = ({ fee }) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeAccount = {
    ...state.account.info.LSK,
    hwInfo: isEmpty(state.account.hwInfo) ? undefined : state.account.hwInfo,
    passphrase: state.account.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      account: activeAccount,
      transactionObject: {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
        fee: toRawLsk(fee.value),
        amount: activeAccount.legacy.balance,
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
