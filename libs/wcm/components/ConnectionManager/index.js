import React, { useEffect, useState } from 'react';
import { createSignClient } from '@libs/wcm/utils/connectionCreator';
import useWalletConnectEventsManager from '@libs/wcm/hooks/useConnectionEventsManager';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import usePairings from '@libs/wcm/hooks/usePairings';
import useSession from '@libs/wcm/hooks/useSession';

const ConnectionManager = ({ history }) => {
  const [initialized, setInitialized] = useState(false);
  const { pairings, setPairings } = usePairings(initialized);
  const { session } = useSession(initialized);
  useWalletConnectEventsManager(history, pairings, setPairings);

  useEffect(() => {
    if (!initialized) {
      createSignClient().then(setInitialized);
    }
  }, [initialized]);

  useEffect(() => {
    if (pairings) {
      if (!session) {
        addSearchParamsToUrl(history, { modal: 'connectionProposal' });
      } else {
        // @todo we probably want to move this view to settings and not trigger it here
        addSearchParamsToUrl(history, { modal: 'sessionManager' });
      }
    }
  }, [session, pairings]);

  return (<div />);
};

export default ConnectionManager;
