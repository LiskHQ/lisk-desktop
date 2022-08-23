import React, { useEffect, useState } from 'react';
import { createSignClient } from '@libs/wcm/utils/connectionCreator';
import useWalletConnectEventsManager from '@libs/wcm/hooks/useConnectionEventsManager';

const ConnectionManager = ({ history }) => {
  const [initialized, setInitialized] = useState(false);
  useWalletConnectEventsManager(history);

  useEffect(() => {
    if (!initialized) {
      createSignClient().then(setInitialized);
    }
  }, [initialized]);

  return (<div />);
};

export default ConnectionManager;
