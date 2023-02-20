import { useCallback, useEffect } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import { EVENTS } from '../constants/lifeCycle';
import { usePairings } from './usePairings';

export const useWalletConnectEventsManager = ({
  pushEvent, session, setSession,
}) => {
  const { disconnect } = usePairings();
  const onSessionRequest = useCallback(async (event) => {
    const request = client.session.get(event.topic);

    setSession({ ...session, request });
  }, []);

  const onSessionDelete = useCallback((event) => {
    disconnect(event.topic);
  }, []);

  const eventHandler = useCallback((name, meta) => {
    pushEvent({ name, meta });

    if (name === EVENTS.SESSION_DELETE) {
      onSessionDelete(meta);
    } else if (name === EVENTS.SESSION_REQUEST) {
      onSessionRequest(meta);
    }
  }, []);

  useEffect(() => {
    if (client?.on) {
      Object.keys(EVENTS).forEach((eventName) => {
        client.on(EVENTS[eventName], eventHandler.bind(null, EVENTS[eventName]));
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('There was an error initializing the client');
    }
  }, [
    onSessionRequest,
    onSessionDelete,
    eventHandler,
    client?.on,
  ]);
};
