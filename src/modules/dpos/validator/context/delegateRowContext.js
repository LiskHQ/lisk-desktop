import { createContext } from 'react';

const DelegateRowContext = createContext(
  {
    data: {},
    activeTab: '',
    watched: '',
    addToWatchList: () => {},
    removeFromWatchList: () => {},
    time: '',
    theme: '',
    t: str => str,
  },
);

export default DelegateRowContext;
