import * as lsk from './lsk';
import * as btc from './btc';
import { tokenMap } from '../../../constants/tokens';

const resourceMap = {
  [tokenMap.LSK.key]: lsk,
  [tokenMap.BTC.key]: btc,
};

export const getTransaction = (data, token) => resourceMap[token].getTransaction(data);

export const getTransactions = (data, token) => resourceMap[token].getTransactions(data);

export const getRegisteredDelegates = data => resourceMap.LSK.getTransactions(data);

export const getTransactionStats = data => resourceMap.LSK.getTransactionStats(data);
