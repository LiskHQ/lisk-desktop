/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { signTransaction } from '@transaction/api';
import { getAccount } from '@wallet/utils/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { networkStatusUpdated } from '@network/store/action';
import { selectCurrentApplicationChainID } from "@blockchainApplication/manage/store/selectors";
import transactionActionTypes from '@transaction/store/actionTypes';
import actionTypes from './actionTypes';

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
export const getAccounts = async ({ network, params }) =>
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
 * This action is used to update account balance when new block was generated and
 * account middleware detected that it contains a transaction that affects balance
 * of the active account
 *
 * @param {String} tokensTypes - Options of 'enabled' and 'active'
 */
export const accountDataUpdated = tokensTypes =>
  async (dispatch, getState) => {
    const { network, token, wallet } = getState();

    // Get the list of tokens that are enabled
    const activeTokens = tokensTypes === 'enabled'
      ? Object.keys(token.list)
        .filter(key => token.list[key])
      : [token.active];

    // Collect their addresses to send to the API
    const params = activeTokens.reduce((acc, item) => {
      acc[item] = { publicKey: wallet.info[item].summary.publicKey };
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

export const multisigGroupRegistered = (
  formProps,
  transactionJSON,
  privateKey,
) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const wallet = state.account?.current?.hw
    ? state.account.current
    : selectActiveTokenAccount(state);

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    signTransaction({
      transactionJSON,
      wallet,
      schema: state.network.networks.LSK.moduleCommandSchemas[formProps.moduleCommand],
      chainID: selectCurrentApplicationChainID(state),
      privateKey,
    }),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: transactionActionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: transactionActionTypes.transactionSignError,
      data: error,
    });
  }
};
