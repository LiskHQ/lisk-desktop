import { useCallback, useEffect, useContext } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';

export const ConnectionEventsManagerWrapper = ({ children }) => {
  const { pushEvent } = useEvents();
  const { setSessionRequest, setSessions } = useSession();
  const { signClient } = useContext(ConnectionContext);

  const onSessionRequest = useCallback(async (event) => {
    const request = signClient.session.get(event.topic);
    setSessionRequest(request);
  }, []);

  const onSessionDelete = useCallback((event) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.topic !== event.topic));
  }, []);

  const eventHandler = useCallback(async (name, meta) => {
    pushEvent({ name, meta });

    if (name === EVENTS.SESSION_DELETE) {
      onSessionDelete(meta);
    } else if (name === EVENTS.SESSION_REQUEST) {
      await onSessionRequest(meta);
    }
  }, []);

  useEffect(() => {
    if (signClient?.on) {
      Object.keys(EVENTS).forEach((eventName) => {
        signClient.on(EVENTS[eventName], eventHandler.bind(null, EVENTS[eventName]));
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('There was an error initializing the client');
    }
  }, [onSessionRequest, onSessionDelete, eventHandler, signClient?.on]);

  return children;
};
