import { getAccount, extractAddress, extractPublicKey } from '../../utils/api/account';
import { getDelegate } from '../../utils/api/delegate';
import { accountLoggedIn } from '../../actions/account';
import actionTypes from '../../constants/actions';

const loginMiddleware = () => next => (action) => {
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
        next(accountLoggedIn(Object.assign({}, accountData, accountBasics,
          { delegate: delegateData.delegate, isDelegate: true })));
      }).catch(() => {
        next(accountLoggedIn(Object.assign({}, accountData, accountBasics,
          { delegate: {}, isDelegate: false })));
      }),
  );
};

export default loginMiddleware;
