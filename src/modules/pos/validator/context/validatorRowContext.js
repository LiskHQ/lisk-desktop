/* istanbul ignore file */
import { createContext } from 'react';

const ValidatorRowContext = createContext({
  data: {
    value: '',
    state: 'generating',
    status: 'active',
    time: '',
    totalStakeReceived: 0,
  },
  activeTab: 'active',
  watched: '',
  addToWatchList: () => {},
  removeFromWatchList: () => {},
  time: '',
  theme: 'light',
  t: (str) => str,
});

export default ValidatorRowContext;
