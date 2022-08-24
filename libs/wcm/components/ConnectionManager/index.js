import React, { useEffect, useState } from 'react';
import { createSignClient } from '../../utils/connectionCreator';
import useWalletConnectEventsManager from '../../hooks/useConnectionEventsManager';

const ConnectionManager = () => {
  const [initialized, setInitialized] = useState(false);
  useWalletConnectEventsManager();

  useEffect(() => {
    if (!initialized) {
      createSignClient().then(setInitialized);
    }
  }, [initialized]);

  return (<div />);
};

export default ConnectionManager;
