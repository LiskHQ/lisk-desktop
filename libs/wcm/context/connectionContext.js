/* istanbul ignore file */
import { createContext } from 'react';

const ConnectionContext = createContext({
  events: [],
  pairings: [],
  sessions: [],
  sessionProposal: null,
  sessionRequest: null,
});

export default ConnectionContext;
