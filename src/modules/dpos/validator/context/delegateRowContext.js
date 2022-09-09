/* istanbul ignore file */
import { createContext } from 'react';

const DelegateRowContext = createContext({
  data: {
    value: '',
    state: 'forging',
    status: 'active',
    time: '',
    totalVotesReceived: 0,
  },
  activeTab: 'active',
  watched: '',
  addToWatchList: () => {},
  removeFromWatchList: () => {},
  time: '',
  theme: 'light',
  t: (str) => str,
});

export default DelegateRowContext;
