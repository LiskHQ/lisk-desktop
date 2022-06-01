/* istanbul ignore file */
import { createContext } from 'react';

const DelegateTabContext = createContext(
  {
    blocks: [],
    delegatesWithForgingTimes: [],
    filters: '',
    watchList: [],
    t: str => str,
    standByDelegates: [],
    sanctionedDelegates: [],
    watchedDelegates: [],
    activeTab: '',
  },
);

export default DelegateTabContext;
