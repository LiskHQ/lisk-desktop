/* istanbul ignore file */
import { createContext } from 'react';

const ConnectionContext = createContext({
  events: [],
  pairings: [],
  sessions: [],
  sessionProposal: null,
  sessionRequest: null,
  signClient: null,
});

export default ConnectionContext;
