/* istanbul ignore file */
import { createContext } from 'react';

const ConnectionContext = createContext(
  {
    events: [],
    pairings: [],
    session: {
      request: false,
      data: false,
      loaded: false,
    },
  },
);

export default ConnectionContext;
