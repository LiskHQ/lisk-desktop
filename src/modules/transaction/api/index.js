import functionMapper from '@common/utilities/api/functionMapper';
import * as lsk from './lsk';
import * as btc from './btc';

const transactionAPI = functionMapper(lsk, btc);

export const broadcast = transactionAPI.broadcast;
export const calculateTransactionFee = transactionAPI.calculateTransactionFee;
export const create = transactionAPI.create;
export const computeTransactionId = transactionAPI.computeTransactionId;
export const createTransactionInstance = transactionAPI.createTransactionInstance;
export const getMinTxFee = transactionAPI.getMinTxFee;
export const getRegisteredDelegates = transactionAPI.getRegisteredDelegates;
export const getTransaction = transactionAPI.getTransaction;
export const getTransactionBaseFees = transactionAPI.getTransactionBaseFees;
export const getTransactionFee = transactionAPI.getTransactionFee;
// eslint-disable-next-line max-len
export const getTransactionFeeFromUnspentOutputs = transactionAPI.getTransactionFeeFromUnspentOutputs;
export const getTransactionStats = transactionAPI.getTransactionStats;
export const getTransactions = transactionAPI.getTransactions;
export const getUnspentTransactionOutputs = transactionAPI.getUnspentTransactionOutputs;
export const getSchemas = transactionAPI.getSchemas;
export const createMultiSignatureTransaction = transactionAPI.createMultiSignatureTransaction;
