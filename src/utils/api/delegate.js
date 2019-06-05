import i18next from 'i18next';
import Lisk from '@liskhq/lisk-client';
import { loginType } from '../../constants/hwConstants';
import { voteWithHW } from '../../utils/api/hwWallet';

// TODO remove listAccountDelegates and use getVotes defined below
export const listAccountDelegates = (liskAPIClient, address) =>
  liskAPIClient.votes.get({ address, limit: '101' });

// TODO remove the !liskAPIClient condition
export const listDelegates = (liskAPIClient, options) => new Promise((resolve, reject) => {
  if (!liskAPIClient) {
    reject();
  } else {
    liskAPIClient.delegates.get(options)
      .then(response => resolve(response))
      .catch(reject);
  }
});

// TODO remove getDelegate and use listDelegates defined above
export const getDelegate = (liskAPIClient, options) =>
  liskAPIClient.delegates.get(options);


export const splitVotesIntoRounds = ({ votes, unvotes }) => {
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

export const voteWithPassphrase = (
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

export const vote = async ({
  liskAPIClient,
  account,
  votedList,
  unvotedList,
  secondPassphrase,
  timeOffset,
}) => {
  switch (account.loginType) {
    case loginType.normal:
      return voteWithPassphrase(
        liskAPIClient, account.passphrase, account.publicKey,
        votedList, unvotedList, secondPassphrase, timeOffset,
      );
    case loginType.ledger:
      return voteWithHW(liskAPIClient, account, votedList, unvotedList);
    default:
      return new Promise((resolve, reject) => {
        reject(i18next.t('Login Type not recognized.'));
      });
  }
};

export const getVotes = (liskAPIClient, { address, offset, limit }) =>
  liskAPIClient.votes.get({ address, limit, offset });

// TODO remove getAllVotes and use getVotes with limit:101
// because lisk-core increased the max limit from 100 to 101 since
// this function was written here.
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
      .catch(reject);
  });
};
