import { getAccountStatus, getAccount, transactions } from '../../utils/api/account';
import { accountUpdated, accountLoggedIn } from '../../actions/account';
import { transactionsUpdated } from '../../actions/transactions';
import { activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';
import { fetchAndUpdateForgedBlocks } from '../../actions/forging';
import { getDelegate } from '../../utils/api/delegate';
import transactionTypes from '../../constants/transactionTypes';

const updateAccountData = (store) => { // eslint-disable-line
  const { peers, account } = store.getState();

  getAccount(peers.data, account.address).then((result) => {
    if (result.balance !== account.balance) {
      const maxBlockSize = 25;
      transactions(peers.data, account.address, maxBlockSize)
        .then(response => store.dispatch(transactionsUpdated({
          confirmed: response.transactions,
          count: parseInt(response.count, 10),
        })));
      if (account.isDelegate) {
        store.dispatch(fetchAndUpdateForgedBlocks({
          activePeer: peers.data,
          limit: 10,
          offset: 0,
          generatorPublicKey: account.publicKey,
        }));
      }
    }
    store.dispatch(accountUpdated(result));
  });

  return getAccountStatus(peers.data).then(() => {
    store.dispatch(activePeerUpdate({ online: true }));
  }).catch((res) => {
    store.dispatch(activePeerUpdate({ online: false, code: res.error.code }));
  });
};

const delegateRegistration = (store, action) => {
  const delegateRegistrationTx = action.data.confirmed.filter(
    transaction => transaction.type === transactionTypes.registerDelegate)[0];
  const state = store.getState();

  if (delegateRegistrationTx) {
    getDelegate(state.peers.data, state.account.publicKey)
      .then((delegateData) => {
        store.dispatch(accountLoggedIn(Object.assign({},
          { delegate: delegateData.delegate, isDelegate: true })));
      });
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.metronomeBeat:
      updateAccountData(store);
      break;
    case actionTypes.transactionsUpdated:
      delegateRegistration(store, action);
      break;
    default: break;
  }
};

export default accountMiddleware;
