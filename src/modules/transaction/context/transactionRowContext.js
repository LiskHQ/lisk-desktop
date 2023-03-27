import { createContext } from 'react';

const TransactionRowContext = createContext({
  data: {},
  host: '',
  currentBlockHeight: 0,
});

export default TransactionRowContext;
