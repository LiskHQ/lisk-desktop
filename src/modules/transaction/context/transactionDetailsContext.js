import { createContext } from 'react';

const TransactionDetailsContext = createContext({
  transaction: {},
  wallet: {},
});

export default TransactionDetailsContext;
