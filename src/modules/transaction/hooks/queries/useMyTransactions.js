import { MY_TRANSACTIONS } from 'src/const/queries';
import { useTransactions } from './useTransactions';

export const useMyTransactions = ({ config, options } = {}) =>
  useTransactions({
    keys: [MY_TRANSACTIONS],
    config,
    options,
  });
