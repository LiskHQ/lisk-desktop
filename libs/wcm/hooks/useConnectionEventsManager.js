import { useCallback, useEffect, useContext } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { EVENTS } from '../constants/lifeCycle';

const useWalletConnectEventsManager = () => {
  const {
    pushEvent, disconnect, session, setSession,
  } = useContext(ConnectionContext);

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
    }
  }, [
    onSessionRequest,
    onSessionDelete,
    eventHandler,
    client?.on,
  ]);
};

export default useWalletConnectEventsManager;
