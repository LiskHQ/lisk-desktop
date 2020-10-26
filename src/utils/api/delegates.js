import Lisk from '@liskhq/lisk-client'; // eslint-disable-line
import { getBlocks } from './blocks';
import { getTransactions } from './transactions';
import transactionTypes from '../../constants/transactionTypes';
import { getAPIClient } from './lsk/network';

export const getDelegates = (network, options) =>
  getAPIClient(network).delegates.get(options);

export const getDelegateInfo = (liskAPIClient, { address, publicKey }) => (
  new Promise(async (resolve, reject) => {
    try {
      const response = await getDelegates(liskAPIClient, { address });
      const delegate = response.data[0];
      if (delegate) {
        const txDelegateRegister = (await getTransactions({
          liskAPIClient,
          address,
          limit: 1,
          type: transactionTypes().registerDelegate.apiSpecificCode,
        })).data[0];
        const blocks = await getBlocks(liskAPIClient, {
          generatorPublicKey: publicKey, limit: 1,
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

export const getVotes = (network, { address }) =>
  getAPIClient(network).votes.get({ address });

export const registerDelegate = (
  liskAPIClient,
  username,
  passphrase,
  secondPassphrase = null,
  timeOffset,
  networkIdentifier,
) => {
  const data = { username, passphrase, timeOffset };
  if (secondPassphrase) {
    data.secondPassphrase = secondPassphrase;
  }
  return new Promise((resolve, reject) => {
    const transaction = Lisk.transaction.registerDelegate({ ...data, networkIdentifier });
    liskAPIClient.transactions
      .broadcast(transaction)
      .then(() => {
        resolve(transaction);
      })
      .catch(reject);
  });
};

export const getNextForgers = (liskAPIClient, params) => (
  new Promise((resolve, reject) => {
    liskAPIClient.delegates.getForgers(params)
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  })
);
