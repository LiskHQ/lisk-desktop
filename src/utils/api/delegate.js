import Lisk from '@liskhq/lisk-client';

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


const splitVotesIntoRounds = ({ votes, unvotes }) => {
  const rounds = [];
  const maxCountOfVotesInOneTurn = 33;
  while (votes.length + unvotes.length > 0) {
    const votesLength = Math.min(
      votes.length,
      maxCountOfVotesInOneTurn - Math.min(unvotes.length, 16),
    );
    rounds.push({
      votes: votes.splice(0, votesLength),
      unvotes: unvotes.splice(0, maxCountOfVotesInOneTurn - votesLength),
    });
  }
  return rounds;
};

export const vote = (
  liskAPIClient,
  passphrase,
  publicKey,
  votes,
  unvotes,
  secondPassphrase,
  timeOffset,
) => (
  Promise.all(splitVotesIntoRounds({
    votes: [...votes],
    unvotes: [...unvotes],
  }).map(({ votes, unvotes }) => { // eslint-disable-line no-shadow
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
  }))
);

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
