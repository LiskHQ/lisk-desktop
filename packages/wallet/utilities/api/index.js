import * as lsk from './lsk';
import * as btc from './btc';
import functionMapper from '@common/utilities/api/functionMapper';

const accountAPI = functionMapper(lsk, btc);

export const getAccount = accountAPI.getAccount;
export const getAccounts = accountAPI.getAccounts;
export const extractAddress = accountAPI.extractAddress;
export const extractPublicKey = accountAPI.extractPublicKey;
export const getDerivedPathFromPassphrase = accountAPI.getDerivedPathFromPassphrase;
