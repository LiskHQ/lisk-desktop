import React, { useState } from 'react';
import ConnectionContext from './connectionContext';

const ConnectionProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [events, setEvents] = useState([]);
  const [pairings, setPairings] = useState([]);

  const pushEvent = (event) => {
    setEvents([...events, event]);
  };

  const removePairing = (topic) => {
    const newPairings = pairings.filter(pairing => pairing.topic !== topic);
    setPairings(newPairings);
  };

  const addPairing = (pairing) => {
    setEvents([...pairings, pairing]);
  };

  const value = {
    data,
    events,
    pairings,
    setData,
    pushEvent,
    addPairing,
    setPairings,
    removePairing,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
