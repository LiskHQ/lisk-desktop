/* istanbul ignore file */
// TODO delete this file
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from './loading';
import { getAccount } from '../utils/api/account';
import { getDelegates, getVotes } from '../utils/api/delegates';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import transactionTypes from '../constants/transactionTypes';
import { tokenMap } from '../constants/tokens';

const searchDelegate = ({ publicKey, address }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const networkConfig = getState().network;
    const token = tokenMap.LSK.key;
    const delegates = await getDelegates(liskAPIClient, { publicKey });
    const transactions = await getTransactions({
      token, networkConfig, address, limit: 1, type: transactionTypes.registerDelegate,
    });
    const block = await getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 });
    dispatch({
      data: {
        delegate: {
          ...delegates.data[0],
          lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
          txDelegateRegister: transactions.data[0],
        },
        address,
      },
      type: actionTypes.searchDelegate,
    });
  };


const searchVotes = ({ address }) =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    /* istanbul ignore if */
    if (!liskAPIClient) return;
    dispatch(loadingStarted(actionTypes.searchVotes));
    const votes = await getVotes(liskAPIClient, { address })
      .then(res => res.data.votes || [])
      .catch(() => dispatch(loadingFinished(actionTypes.searchVotes)));

    dispatch({
      type: actionTypes.searchVotes,
      data: { votes, address },
    });
    dispatch(loadingFinished(actionTypes.searchVotes));
  };

// TODO remove this action and use src/utils/withData.js instead
export const searchAccount = ({ address }) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    /* istanbul ignore else */
    if (networkConfig) {
      getAccount({ networkConfig, address }).then((response) => {
        const accountData = {
          ...response,
        };
        if (accountData.delegate && accountData.delegate.username) {
          searchDelegate({ publicKey: accountData.publicKey, address })(dispatch, getState);
        }
        dispatch({ data: accountData, type: actionTypes.searchAccount });
        if (accountData.token === tokenMap.LSK.key) {
          searchVotes({ address })(dispatch, getState);
        }
      });
    }
  };

export default searchAccount;
