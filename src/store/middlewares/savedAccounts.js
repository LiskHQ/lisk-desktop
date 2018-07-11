import actionTypes from '../../constants/actions';
import { accountLoading, accountLoggedOut } from '../../actions/account';
import { accountsRetrieved, accountSaved } from '../../actions/savedAccounts';
import { activePeerSet } from '../../actions/peers';
import { getAccount } from '../../utils/api/account';
import { extractAddress } from '../../utils/account';
import { getLastActiveAccount } from '../../utils/savedAccounts';
import getNetwork from '../../utils/getNetwork';
import networks from '../../constants/networks';

const savedAccountsMiddleware = (store) => {
  setImmediate(() => {
    const accountsRetrievedAction = accountsRetrieved();
    const savedAccounts = accountsRetrievedAction.data;
    store.dispatch(accountsRetrievedAction);

    if (savedAccounts && savedAccounts.lastActive) {
      const account = savedAccounts.lastActive;
      const network = Object.assign({}, getNetwork(account.network));

      /* istanbul ignore if  */
      if (account.network === networks.customNode.code) {
        network.address = account.address;
      }

      store.dispatch(activePeerSet({
        publicKey: account.publicKey,
        network,
      }));
    }
  });

  const isSameNetwork = (account, peers) => peers.data.currentNode.indexOf(account.address) > -1
    && peers.options.code === account.network;

  const updateSavedAccounts = (peers, accounts) => {
    accounts.forEach((account, i) => {
      const address = extractAddress(account.publicKey);
      if (isSameNetwork(account, peers)) {
        getAccount(peers.data, address).then((result) => {
          if (result.balance !== account.balance) {
            accounts[i].balance = result.balance;
            store.dispatch({
              data: {
                accounts,
                lastActive: getLastActiveAccount(),
              },
              type: actionTypes.accountsRetrieved,
            });
          }
        });
      }
    });
  };

  const checkTransactionsAndUpdateSavedAccounts = (peers, tx, savedAccounts) => {
    const changedAccounts = savedAccounts.accounts.filter((account) => {
      const address = extractAddress(account.publicKey);
      const relevantTransactions = tx.filter((transaction) => {
        const sender = transaction ? transaction.senderId : null;
        const recipient = transaction ? transaction.recipientId : null;
        return (address === recipient || address === sender);
      });
      return relevantTransactions.length > 0;
    });
    updateSavedAccounts(peers, changedAccounts);
  };

  return next => (action) => {
    next(action);
    const { peers, account, savedAccounts } = store.getState();
    switch (action.type) {
      case actionTypes.newBlockCreated:
        checkTransactionsAndUpdateSavedAccounts(
          peers,
          action.data.block.transactions || [],
          savedAccounts,
        );
        break;
      case actionTypes.accountSwitched:
        store.dispatch(accountLoading());
        store.dispatch(activePeerSet({
          publicKey: action.data.publicKey,
          passphrase: action.data.passphrase,
          network: {
            ...getNetwork(action.data.network),
            address: action.data.address,
          },
        }));
        break;
      case actionTypes.activeAccountSaved:
        store.dispatch(accountSaved({
          balance: account.balance,
          publicKey: account.publicKey,
          network: peers.options.code,
          address: peers.options.address,
        }));
        break;
      case actionTypes.accountLoggedIn:
        updateSavedAccounts(peers, savedAccounts.accounts);
        store.dispatch(accountSaved({
          passphrase: action.data.passphrase,
          balance: action.data.balance,
          publicKey: action.data.publicKey,
          network: peers.options.code,
          address: peers.options.address,
        }));
        break;
      case actionTypes.accountRemoved:
        if (savedAccounts.accounts.length === 0) {
          store.dispatch(accountLoggedOut());
        }
        break;
      default:
        break;
    }
  };
};

export default savedAccountsMiddleware;
