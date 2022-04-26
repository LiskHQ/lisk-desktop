import { createContext } from 'react';

const TransactionDetailsContext = createContext(
  {
    transaction: {},
    account: {},
  },
);

export default TransactionDetailsContext;
