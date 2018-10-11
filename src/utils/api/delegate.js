import Lisk from 'lisk-elements';

export const listAccountDelegates = (activePeer, address) =>
  activePeer.votes.get({ address, limit: '101' });

export const listDelegates = (activePeer, options) => new Promise((resolve, reject) => {
  if (!activePeer) {
    reject();
  } else {
    activePeer.delegates.get(options).then(response => resolve(response));
  }
});

export const getDelegate = (activePeer, options) =>
  activePeer.delegates.get(options);

export const vote = (
  activePeer,
  passphrase,
  publicKey,
  votes,
  unvotes,
  secondPassphrase,
  timeOffset,
) => {
  const transaction = Lisk.transaction.castVotes({
    votes,
    unvotes,
    passphrase,
    secondPassphrase,
    timeOffset,
  });
  return new Promise((resolve, reject) => {
    activePeer.transactions.broadcast(transaction).then(() => resolve(transaction)).catch(reject);
  });
};

export const getVotes = (activePeer, { address, offset, limit }) =>
  activePeer.votes.get({ address, limit, offset });

export const getAlllVotes = (activePeer, address) =>
  new Promise((resolve, reject) => {
    getVotes(activePeer, { address, offset: 0, limit: 100 }).then((votesEarlyBatch) => {
      if (votesEarlyBatch.data.votes && votesEarlyBatch.data.votes.length < 50) {
        return resolve(votesEarlyBatch.data.votes);
      }
      return getVotes(activePeer, { address, offset: 101, limit: 1 }).then(votesLasteBatch =>
        resolve([...votesEarlyBatch.data.votes, ...votesLasteBatch.data.votes])).catch(reject);
    }).catch(reject);
  });

export const getVoters = (activePeer, publicKey) =>
  activePeer.voters.get({ publicKey });

export const registerDelegate = (
  activePeer,
  username,
  passphrase,
  secondPassphrase = null,
  timeOffset,
) => {
  const data = { username, passphrase, timeOffset };
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
