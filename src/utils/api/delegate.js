import Lisk from 'lisk-elements';

export const listAccountDelegates = (liskAPIClient, address) =>
  liskAPIClient.votes.get({ address, limit: '101' });

export const listDelegates = (liskAPIClient, options) => new Promise((resolve, reject) => {
  if (!liskAPIClient) {
    reject();
  } else {
    liskAPIClient.delegates.get(options)
      .then(response => resolve(response))
      .catch(error => reject(error));
  }
});

export const getDelegate = (liskAPIClient, options) =>
  liskAPIClient.delegates.get(options);

export const vote = (
  liskAPIClient,
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
    liskAPIClient.transactions.broadcast(transaction)
      .then(() => resolve(transaction)).catch(reject);
  });
};

export const getVotes = (liskAPIClient, { address, offset, limit }) =>
  liskAPIClient.votes.get({ address, limit, offset });

export const getAllVotes = (liskAPIClient, address) =>
  new Promise((resolve, reject) => {
    getVotes(liskAPIClient, { address, offset: 0, limit: 100 }).then((votesEarlyBatch) => {
      if (votesEarlyBatch.data.votes && votesEarlyBatch.data.votesUsed < 101) {
        return resolve(votesEarlyBatch);
      }
      return getVotes(liskAPIClient, { address, offset: 100, limit: 1 }).then((votesLasteBatch) => {
        votesEarlyBatch.data.votes = [...votesEarlyBatch.data.votes, ...votesLasteBatch.data.votes];
        return resolve(votesEarlyBatch);
      }).catch(reject);
    }).catch(reject);
  });

export const getVoters = (liskAPIClient, { publicKey, offset = 0, limit = 100 }) =>
  liskAPIClient.voters.get({ publicKey, offset, limit });

export const registerDelegate = (
  liskAPIClient,
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
    liskAPIClient.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
