import * as lsk from './lsk';
import * as btc from './btc';
import { tokenMap } from '../../../constants/tokens';

const resourceMap = {
  [tokenMap.LSK.key]: lsk,
  [tokenMap.BTC.key]: btc,
};

export const getAccount = (data, token) => resourceMap[token].getAccount(data);

export const getAccounts = (data, token) => resourceMap[token].getAccounts(data);
