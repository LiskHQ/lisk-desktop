import { useCallback, useEffect } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import { EVENTS } from '../constants/lifeCycle';
import { useSession } from '../hooks/useSession';
import { useEvents } from '../hooks/useEvents';

export const ConnectionEventsManagerWrapper = ({ children }) => {
  const { pushEvent } = useEvents();
  const { setSessionRequest, setSessions } = useSession();

  const onSessionRequest = useCallback(async (event) => {
    const request = client.session.get(event.topic);
    setSessionRequest(request);
  }, []);

  const onSessionDelete = useCallback((event) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.topic !== event.topic));
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
  }, [onSessionRequest, onSessionDelete, eventHandler, client?.on]);

  return children;
};
