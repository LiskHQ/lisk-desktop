import { createContext } from 'react';

const ConnectionContext = createContext(
  {
    data: { name: 'something' },
  },
);

export default ConnectionContext;
