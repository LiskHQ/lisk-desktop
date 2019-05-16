import i18next from 'i18next';
import to from 'await-to-js';
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { send, getTransactions, getSingleTransaction } from '../utils/api/transactions';
import { getDelegate } from '../utils/api/delegate';
import { loadDelegateCache } from '../utils/delegates';
import { extractAddress } from '../utils/account';
import { passphraseUsed } from './account';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import { toRawLsk } from '../utils/lsk';
import { sendWithHW } from '../utils/api/hwWallet';
import { loginType } from '../constants/hwConstants';

export const cleanTransactions = () => ({
  type: actionTypes.cleanTransactions,
});

/**
 * This action is used when a new pending transaction is sent to the network.
 * It is used in send, vote, second passphrase registration, and delegate registration.
 *
 * @param {Object} data - the transaction object
 */
export const transactionAdded = data => ({
  data,
  type: actionTypes.transactionAdded,
});

export const testExtensions = () => ({
  type: 'extensinonTest',
});

export const loadTransactionsFinish = accountUpdated =>
  (dispatch) => {
    dispatch(loadingFinished(actionTypes.transactionsLoad));
    dispatch({
      data: accountUpdated,
      type: actionTypes.transactionsLoadFinish,
    });
  };

/**
 * This action is used to request transactions on dashboard and wallet page.
 *
 * @param {Object} params - all params
 * @param {String} params.address - address of the account to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Number} params.offste - index of the first transaction
 * @param {Number} params.filter - one of values from src/constants/transactionFilters.js
 * @param {Object} params.customFilters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 */
export const transactionsRequested = ({
  address, limit, offset, filter, customFilters,
}) =>
  (dispatch, getState) => {
    dispatch(loadingStarted(actionTypes.transactionsRequested));
    const networkConfig = getState().network;
    getTransactions({
      networkConfig, address, limit, offset, filter, customFilters,
    })
      .then((response) => {
        dispatch({
          data: {
            count: parseInt(response.meta.count, 10),
            confirmed: response.data,
            address,
            filter,
            customFilters,
          },
          type: offset > 0 ? actionTypes.transactionsUpdated : actionTypes.transactionsLoaded,
        });
        if (filter !== undefined) {
          dispatch({
            data: {
              filterName: 'wallet',
              value: filter,
            },
            type: actionTypes.addFilter,
          });
        }
        dispatch(loadingFinished(actionTypes.transactionsRequested));
      });
  };

/**
 * This action is used to get the data for "My Wallet Details" module on wallet page
 * which shows Last transactions. It cannot get the latest transaction from the list,
 * because the list can be filtered.
 *
 * @param {String} address - address of the active account
 */
export const loadLastTransaction = address => (dispatch, getState) => {
  const networkConfig = getState().network;
  if (networkConfig) {
    dispatch({ type: actionTypes.transactionCleared });
    getTransactions({
      networkConfig, address, limit: 1, offset: 0,
    }).then(response => dispatch({ data: response.data[0], type: actionTypes.transactionLoaded }));
  }
};

/**
 * This action is used to get the data for transaction detail page.
 *
 * @param {String} id - id of the transaction
 */
export const loadTransaction = ({ id }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const networkConfig = getState().network;
    dispatch({ type: actionTypes.transactionCleared });
    // TODO remove the btc condition
    getSingleTransaction(localStorage.getItem('btc') ? { networkConfig, id } : { liskAPIClient, id })
      .then((response) => { // eslint-disable-line max-statements
        let added = [];
        let deleted = [];

        if (!response.data.length) {
          dispatch({ data: { error: i18next.t('Transaction not found') }, type: actionTypes.transactionLoadFailed });
          return;
        }

        // since core 1.0 added and deleted are not filtered in core,
        // but provided as single array with [+,-] signs
        if (response.data[0].asset && 'votes' in response.data[0].asset) {
          added = response.data[0].asset.votes.filter(item => item.startsWith('+')).map(item => item.replace('+', ''));
          deleted = response.data[0].asset.votes.filter(item => item.startsWith('-')).map(item => item.replace('-', ''));
        }

        const localStorageDelegates = loadDelegateCache(getState().peers);
        deleted.forEach((publicKey) => {
          const address = extractAddress(publicKey);
          const storedDelegate = localStorageDelegates[address];
          if (storedDelegate) {
            dispatch({
              data: {
                delegate: {
                  username: storedDelegate.username,
                  address,
                },
                voteArrayName: 'deleted',
              },
              type: actionTypes.transactionAddDelegateName,
            });
          } else {
            getDelegate(liskAPIClient, { publicKey })
              .then((delegateData) => {
                dispatch({
                  data: { delegate: delegateData.data[0], voteArrayName: 'deleted' },
                  type: actionTypes.transactionAddDelegateName,
                });
              });
          }
        });

        added.forEach((publicKey) => {
          const address = extractAddress(publicKey);
          if (localStorageDelegates[address]) {
            dispatch({
              data: { delegate: { ...localStorageDelegates[address], address }, voteArrayName: 'added' },
              type: actionTypes.transactionAddDelegateName,
            });
          } else {
            getDelegate(liskAPIClient, { publicKey })
              .then((delegateData) => {
                dispatch({
                  data: { delegate: delegateData.data[0], voteArrayName: 'added' },
                  type: actionTypes.transactionAddDelegateName,
                });
              });
          }
        });
        dispatch({ data: response.data[0], type: actionTypes.transactionLoaded });
      }).catch((error) => {
        dispatch({ data: { error }, type: actionTypes.transactionLoadFailed });
      });
  };

export const transactionsUpdated = ({
  address, limit, filter, customFilters,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;

    getTransactions({
      networkConfig, address, limit, filter, customFilters,
    })
      .then((response) => {
        if (filter === getState().transactions.filter) {
          dispatch({
            data: {
              confirmed: response.data,
              count: parseInt(response.meta.count, 10),
            },
            type: actionTypes.transactionsUpdated,
          });
        }
      });
  };

const handleSentError = ({ error, account, dispatch }) => {
  let text;
  switch (account.loginType) {
    case loginType.normal:
      text = error && error.message ? `${error.message}.` : i18next.t('An error occurred while creating the transaction.');
      break;
    case loginType.ledger:
      text = i18next.t('You have cancelled the transaction on your hardware wallet. You can either continue or retry.');
      break;
    default:
      text = error.message;
  }
  dispatch({
    data: { errorMessage: text },
    type: actionTypes.transactionFailed,
  });
};

export const sent = ({
  account, recipientId, amount, passphrase, secondPassphrase, data,
}) =>
// eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    // account.loginType = 1;
    let error;
    let callResult;
    const liskAPIClient = getState().peers.liskAPIClient;
    const timeOffset = getTimeOffset(getState());
    switch (account.loginType) {
      case loginType.normal:
        // eslint-disable-next-line
        [error, callResult] = await to(send(liskAPIClient, recipientId, toRawLsk(amount), passphrase, secondPassphrase, data, timeOffset));
        break;
      case loginType.ledger:
        // eslint-disable-next-line
        [error, callResult] = await to(sendWithHW(liskAPIClient, account, recipientId, toRawLsk(amount), secondPassphrase, data));
        break;
      // case 2:
      //   errorMessage = i18next.t('Not Yet Implemented. Sorry.');
      //   dispatch({ data: { errorMessage }, type: actionTypes.transactionFailed });
      //   break;
      default:
        dispatch({ data: { errorMessage: i18next.t('Login Type not recognized.') }, type: actionTypes.transactionFailed });
    }
    loadingFinished('sent');
    if (error) {
      handleSentError({ error, account, dispatch });
    } else {
      dispatch(transactionAdded({
        id: callResult.id,
        senderPublicKey: account.publicKey,
        senderId: account.address,
        recipientId,
        amount: toRawLsk(amount),
        fee: Fees.send,
        type: transactionTypes.send,
        asset: { data },
      }));
      dispatch(passphraseUsed(passphrase));
    }
  };
