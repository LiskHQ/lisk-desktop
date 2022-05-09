/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import loginTypes from 'src/modules/auth/const/loginTypes';
import { tokenMap } from '@token/fungible/consts/tokens';
import { getAccount, extractAddress as extractBitcoinAddress } from '@wallet/utils/api';
import { getConnectionErrorMessage } from '@network/utils/getNetwork';
import { extractKeyPair } from '@wallet/utils/account';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';
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
    const { network, settings, token } = getState();
    const { enableCustomDerivationPath, customDerivationPath } = settings;
    dispatch(accountLoading());

    const params = Object.keys(token.list)
      .filter(key => token.list[key])
      .reduce((acc, acctToken) => {
        if (acctToken === tokenMap.BTC.key) {
          acc[acctToken] = {
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
          acc[acctToken] = {
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
