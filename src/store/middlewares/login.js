import { replace } from 'react-router-redux';
import { getAccount, extractAddress, extractPublicKey } from '../../utils/api/account';
import { getDelegate } from '../../utils/api/delegate';
import { accountUpdated } from '../../actions/account';
import actionTypes from '../../constants/actions';

const loginMiddleware = store => next => (action) => {
  // get account info
  if (action.type !== actionTypes.activePeerSet) {
    return next(action);
  }

  next(Object.assign({}, action, { data: action.data.activePeer }));

  const { passphrase } = action.data;
  const publicKey = extractPublicKey(passphrase);
  const address = extractAddress(passphrase);
  const accountBasics = {
    passphrase,
    publicKey,
    address,
  };
  const { activePeer } = action.data;

  // redirect to main/transactions
  return getAccount(activePeer, address).then(accountData =>
    getDelegate(activePeer, publicKey)
      .then((delegateData) => {
        next(accountUpdated(Object.assign({}, accountData, accountBasics,
          { delegate: delegateData.delegate, isDelegate: true })));
        replace('/main/transactions');
      }).catch(() => {
        next(accountUpdated(Object.assign({}, accountData, accountBasics,
          { delegate: {}, isDelegate: false })));
        replace('/main/transactions');
      }),
  );
};

export default loginMiddleware;
