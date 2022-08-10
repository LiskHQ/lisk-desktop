import React, { useEffect, useState } from 'react';
import { createSignClient } from '@libs/wcm/utils/connectionCreator';
import useWalletConnectEventsManager from '@libs/wcm/hooks/useConnectionEventsManager';
import usePairings from '@libs/wcm/hooks/usePairings';

const ConnectionManager = ({ history }) => {
  const [initialized, setInitialized] = useState(false);
  const { pairings, setPairings } = usePairings(initialized);
  useWalletConnectEventsManager(history, pairings, setPairings);

  useEffect(() => {
    if (!initialized) {
      createSignClient().then(setInitialized);
    }
  }, [initialized]);

  return (<div />);
};

export default ConnectionManager;
