import React, { useState } from 'react';
import ConnectionContext from './connectionContext';

const ConnectionProvider = ({ children }) => {
  const [session, setSession] = useState({
    request: false,
    data: false,
    loaded: false,
  });
  const [events, setEvents] = useState([]);
  const [pairings, setPairings] = useState([]);

  const pushEvent = (event) => {
    setEvents([...events, event]);
  };

  const value = {
    events,
    pairings,
    session,
    setSession,
    pushEvent,
    setPairings,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
