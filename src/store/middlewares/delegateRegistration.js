import { getDelegate } from '../../utils/api/delegate';
import { accountLoggedIn } from '../../actions/account';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';

const delegateRegistrationMiddleware = store => next => (action) => {
  if (action.type === actionTypes.transactionsUpdated) {
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
  }
  return next(action);
};

export default delegateRegistrationMiddleware;
