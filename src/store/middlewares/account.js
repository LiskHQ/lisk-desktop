import { getAccountStatus, getAccount, transactions } from '../../utils/api/account';
import { accountUpdated } from '../../actions/account';
import { transactionsUpdated } from '../../actions/transactions';
import { activePeerUpdate } from '../../actions/peers';
import actionTypes from '../../constants/actions';

const updateAccountData = next => (store) => { // eslint-disable-line
  const { peers, account } = store.getState();

  getAccount(peers.data, account.address).then((result) => {
    if (result.balance !== account.balance) {
      const maxBlockSize = 25;
      transactions(peers.data, account.address, maxBlockSize)
      .then(response => next(transactionsUpdated({
        confirmed: response.transactions,
        count: parseInt(response.count, 10),
      })));
    }
    next(accountUpdated(result));
  });

  return getAccountStatus(peers.data).then(() => {
    next(activePeerUpdate({ online: true }));
  }).catch((res) => {
    next(activePeerUpdate({ online: false, code: res.error.code }));
  });
};

const accountMiddleware = store => next => (action) => {
  next(action);
  const update = updateAccountData(next);
  switch (action.type) {
    case actionTypes.metronomeBeat:
      update(store);
      break;
    default: break;
  }
};

export default accountMiddleware;
