import { getAccountStatus, getAccount, transactions } from '../../utils/api/account';
import { accountUpdated } from '../../actions/account';
import { transactionsUpdated } from '../../actions/transactions';
import { activePeerUpdate } from '../../actions/peers';
import actionsType from '../../constants/actions';

const updateAccountData = next => (store) => { // eslint-disable-line
  const { peers, account } = store.getState();
  if (peers.data && account) {
    getAccount(peers.data, account.address).then((result) => {
      if (result.balance !== account.balance) {
        const maxBlockSize = 25;
        transactions(peers.data, account.address, maxBlockSize)
        .then(res => next(transactionsUpdated(res.transactions)));
      }
      next(accountUpdated(result));
    });
    return getAccountStatus(peers.data).then(() => {
      next(activePeerUpdate({ online: true }));
    }).catch(() => {
      next(activePeerUpdate({ online: false }));
    });
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  const update = updateAccountData(next);
  switch (action.type) {
    case actionsType.metronomeBeat:
      update(store);
      break;
    default: break;
  }
};

export default accountMiddleware;
