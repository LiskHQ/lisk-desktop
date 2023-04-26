import React, { useState, useEffect } from 'react';
import ConnectionContext from './connectionContext';
import { createSignClient } from '../utils/connectionCreator';
import { ConnectionEventsManagerWrapper } from './ConnectionEventsManagerWrapper';

const ConnectionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [sessionProposal, setSessionProposal] = useState();
  const [sessionRequest, setSessionRequest] = useState();

  const value = {
    events,
    pairings,
    sessions,
    sessionProposal,
    sessionRequest,
    setSessions,
    setEvents,
    setPairings,
    setSessionProposal,
    setSessionRequest,
  };

  useEffect(() => {
    createSignClient();
  }, []);

  return (
    <ConnectionContext.Provider value={value}>
      <ConnectionEventsManagerWrapper>
        {children}
      </ConnectionEventsManagerWrapper>
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
