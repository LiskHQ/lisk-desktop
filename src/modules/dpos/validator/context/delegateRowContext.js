import { createContext } from 'react';

const DelegateRowContext = createContext(
  {
    data: {},
    activeTab: '',
    watched: '',
    addToWatchList: () => {},
    removeFromWatchList: () => {},
    value: '0',
    state: '',
    time: '',
    status: '',
    isBanned: false,
    totalVotesReceived: '0',
    theme: '',
    t: str => str,
  },
);

export default DelegateRowContext;
