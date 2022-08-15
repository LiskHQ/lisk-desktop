import React, { useState } from 'react';
import ConnectionContext from './connectionContext';

const ConnectionProvider = ({ children }) => {
  const [data, setData] = useState({});

  const value = {
    data,
    setData,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
