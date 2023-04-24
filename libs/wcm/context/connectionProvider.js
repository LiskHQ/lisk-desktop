import React, { useState, useEffect } from 'react';
import ConnectionContext from './connectionContext';
import { createSignClient } from '../utils/connectionCreator';
import { useConnectionEventsManager } from '../hooks/useConnectionEventsManager';

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

  const removeEvent = (event) => {
    const newEvents = events.filter((e) => e.name !== event.name);
    setEvents(newEvents);
  };

  useConnectionEventsManager({
    pushEvent,
    session,
    setSession,
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

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export default ConnectionProvider;
