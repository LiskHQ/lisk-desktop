import { useCallback, useEffect, useContext } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { EVENTS } from '../constants/lifeCycle';

const useWalletConnectEventsManager = () => {
  const {
    data, setData, pushEvent, removePairing,
  } = useContext(ConnectionContext);

  const onSessionRequest = useCallback(async (requestEvent) => {
    const requestSession = client.session.get(requestEvent.topic);

    setData({ ...data, requestSession });
  }, []);

  const onSessionDelete = useCallback((session) => {
    removePairing(session.topic);
  }, []);

  const eventHandler = useCallback((name, meta) => {
    pushEvent({ name, meta });

    switch (name) {
      case EVENTS.SESSION_DELETE:
        onSessionDelete(meta);
        break;
      case EVENTS.SESSION_REQUEST:
        onSessionRequest(meta);
        break;
      default:
        break;
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
