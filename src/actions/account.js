import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import { getAccount } from '../utils/api/account';
import { getConnectionErrorMessage } from '../utils/getNetwork';
import loginTypes from '../constants/loginTypes';
import { networkStatusUpdated } from './network';
import actionTypes from '../constants/actions';

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
export const timerReset = date => ({
  type: actionTypes.timerReset,
  data: date,
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

/**
 * Updated Date on which passphrase was used last.
 * We determine the inactivity duration to sign out automatically
 *
 * @param {Date} data - A native Javascript date object.
 */
export const passphraseUsed = data => ({
  type: actionTypes.passphraseUsed,
  data,
});

async function getAccounts({ network, params }) {
  return Object.keys(params).reduce(async (accountsPromise, token) => {
    const accounts = await accountsPromise;
    const baseUrl = network.networks[token].serviceUrl;
    const account = await getAccount({ network, baseUrl, params: params[token] }, token);
    return {
      ...accounts,
      [token]: account,
    };
  }, Promise.resolve({}));
}

/**
 * This action is used to update account balance when new block was forged and
 * account middleware detected that it contains a transaction that affects balance
 * of the active account
 *
 * @param {String} tokensTypes - Options of 'enabled' and 'active'
 */
export const accountDataUpdated = tokensTypes =>
  async (dispatch, getState) => {
    const state = getState();
    const { network, settings, account } = state;
    const activeTokens = tokensTypes === 'enabled'
      ? Object.keys(settings.token.list)
        .filter(key => settings.token.list[key])
      : [settings.token.active];

    const params = activeTokens.reduce((acc, token) => {
      acc[token] = { address: account.info[token].address };
      return acc;
    }, {});

    const [error, info] = await to(getAccounts({ network, params }));

    if (info) {
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
export const login = ({ passphrase, publicKey, hwInfo }) => async (dispatch, getState) => {
  const { network, settings } = getState();
  dispatch(accountLoading());

  const params = Object.keys(settings.token.list)
    .filter(key => settings.token.list[key])
    .reduce((acc, token) => {
      acc[token] = { passphrase, publicKey };
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
