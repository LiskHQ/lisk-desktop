import Lisk from 'lisk-elements';
import { requestToActivePeer } from './peers';

export const listAccountDelegates = (activePeer, address) =>
  activePeer.votes.get({ address });

export const listDelegates = (activePeer, options) =>
  activePeer.delegates.get(options);

export const getDelegate = (activePeer, options) =>
  activePeer.delegates.get(options);

export const vote = (activePeer, secret, publicKey, voteList, unvoteList, secondSecret = null) =>
  requestToActivePeer(activePeer, 'accounts/delegates', {
    secret,
    publicKey,
    delegates: voteList.map(delegate => `+${delegate}`).concat(unvoteList.map(delegate => `-${delegate}`)),
    secondSecret,
  });

export const getVotes = (activePeer, address) =>
  activePeer.votes.get({ address });

export const getVoters = (activePeer, publicKey) =>
  activePeer.voters.get({ publicKey });

export const registerDelegate = (activePeer, username, passphrase, secondPassphrase = null) => {
  const data = { username, passphrase };
  if (secondPassphrase) {
    data.secondPassphrase = secondPassphrase;
  }
  return new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.registerDelegate({ ...data });
    activePeer.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
