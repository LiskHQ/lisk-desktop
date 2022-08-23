import { createContext } from 'react';

const ConnectionContext = createContext(
  {
    data: {},
    events: [],
    pairings: [],
  },
);

export default ConnectionContext;
