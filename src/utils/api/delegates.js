import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import { getBlocks } from './blocks';
import { getTransactions } from './transactions';
import { loginType } from '../../constants/hwConstants';
import { splitVotesIntoRounds } from '../voting';
import { voteWithHW } from './hwWallet';
import transactionTypes from '../../constants/transactionTypes';

export const getDelegates = (liskAPIClient, options) => liskAPIClient.delegates.get(options);

export const getDelegateInfo = (liskAPIClient, { address }) => (
  new Promise(async (resolve, reject) => {
    try {
      const delegate = (await getDelegates(liskAPIClient, { address })).data[0];
      if (delegate) {
        const txDelegateRegister = (await getTransactions({
          liskAPIClient, address, limit: 1, type: transactionTypes.registerDelegate,
        })).data[0];
        const blocks = await getBlocks(liskAPIClient, {
          generatorAddress: address, limit: 1,
        });
        resolve({
          ...delegate,
          lastBlock: (blocks.data[0] && blocks.data[0].timestamp) || '-',
          txDelegateRegister,
        });
      } else {
        reject(new Error(`"${address}" is not a delegate`));
      }
    } catch (e) {
      reject(e);
    }
  })
);

export const getDelegateByName = (liskAPIClient, name) => new Promise((resolve, reject) => {
  liskAPIClient.delegates.get({ search: name, limit: 101 })
    .then((response) => {
      const delegate = response.data.find(({ username }) => username === name);
      if (delegate) {
        resolve(delegate);
      } else {
        reject(new Error(`No delegate with name ${name} found.`));
      }
    })
    .catch(reject);
});

const voteWithPassphrase = (
  liskAPIClient,
  passphrase,
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

export const castVotes = async ({
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
        liskAPIClient, account.passphrase,
        votedList, unvotedList, secondPassphrase, timeOffset,
      );
    case loginType.ledger:
    case loginType.trezor:
      return voteWithHW(liskAPIClient, account, votedList, unvotedList);
    default:
      return new Promise((resolve, reject) => {
        reject(i18next.t('Login Type not recognized.'));
      });
  }
};

export const getVotes = (liskAPIClient, { address }) =>
  liskAPIClient.votes.get({ address, limit: 101, offset: 0 });

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
