import React, { useState, useEffect } from 'react';
import ConnectionContext from './connectionContext';
import { createSignClient } from '../utils/connectionCreator';
import { useWalletConnectEventsManager } from '../hooks/useConnectionEventsManager';
import { usePairings } from '../hooks/usePairings';

const ConnectionProvider = ({ children }) => {
  const [session, setSession] = useState({
    request: false,
    data: false,
    loaded: false,
  });
  const [events, setEvents] = useState([]);
  const { pairings, setPairings } = usePairings();

  const pushEvent = (event) => {
    setEvents([...events, event]);
  };

  const removeEvent = (event) => {
    const newEvents = events.filter(e => e.name !== event.name);
    setEvents(newEvents);
  };

  useWalletConnectEventsManager({
    pushEvent, session, setSession,
  });

  const value = {
    events,
    pairings,
    session,
    setSession,
    pushEvent,
    removeEvent,
    setPairings,
  };

  useEffect(() => {
    createSignClient();
  }, []);

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
