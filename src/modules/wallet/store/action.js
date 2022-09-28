/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { createGenericTx } from '@transaction/api';
import { getAccount } from '@wallet/utils/api';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { networkStatusUpdated } from '@network/store/action';
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
 * This action is used to update account balance when new block was forged and
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
  transactionObject,
  privateKey,
) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = selectActiveTokenAccount(state);

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    createGenericTx({
      transactionObject,
      wallet: activeWallet,
      schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
      chainID: state.network.networks.LSK.chainID,
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

export const mockGetAccount = () => ({
  type: actionTypes.accountUpdated,
  data: {
    LSK: {
      summary: {
        address: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
        publicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
        // privateKey: '02f810c312805c0b6f7e54cc1bb5086886568cc70b467be9232b8655e2563a50c498ef964e79a4b28e5fc30c1442bb4193df469305e5ff5b3c46c858fb978893'

        legacyAddress: '1246100845591119494L',
        balance: '999995000000',  // Create this value at the time of data retrieval
        username: '',  // Create this value at the time of data retrieval
        isMigrated: true, // Create this value at the time of data retrieval
        isDelegate: false, // Create this value at the time of data retrieval
        isMultisignature: false, // Create this value at the time of data retrieval
      },
      // balances
      token: {
        balance: '999995000000'
      },
      // auth
      sequence: {
        nonce: '2'
      },
      // auth
      keys: {
        numberOfSignatures: 0,
        mandatoryKeys: [],
        optionalKeys: []
      },
      dpos: {
        // dpos -> specific /v3/dpos/delegates. We can use useDelegates hook
        delegate: {
          username: '',
          consecutiveMissedBlocks: 0,
          lastForgedHeight: 14075260,
          isBanned: false,
          totalVotesReceived: '0'
        },
        // dpos -> specific /v3/dpos/votes/sent
        sentVotes: [
          {
            delegateAddress: 'lsk2a2pb5yp267nudcajund7ksepwnubptp4fu429',
            amount: '1000000000',
            // name (optional)
          }
        ],
        // dpos -> /v3/dpos/unlocks
        unlocking: [
          {
            delegateAddress: 'lsknfggfq34u78vmrts7hdhtk57ocw7e96yp8nzh4',
            amount: '1000000000',
            height: {
              start: 16569388,
              end: 16571388
            }
          }
        ]
      }
    }
  },
});
