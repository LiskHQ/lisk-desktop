import { useCallback, useEffect, useContext } from 'react';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { EVENTS } from '../data/chainConfig';

const useWalletConnectEventsManager = (history) => {
  const {
    data, setData, pushEvent, removePairing,
  } = useContext(ConnectionContext);
  const onSessionProposal = useCallback(() => {
    // @todo handle routing on the UI
    addSearchParamsToUrl(history, { modal: 'connectionSummary' });
  }, []);

  const onSessionRequest = useCallback(async (requestEvent) => {
    const requestSession = client.session.get(requestEvent.topic);

    setData({ ...data, requestSession });
    // @todo handle routing on the UI
    addSearchParamsToUrl(history, { modal: 'requestSummary' });
  }, []);

  const onSessionDelete = useCallback((session) => {
    removePairing(session.topic);
  }, []);

  const eventHandler = useCallback((name, meta) => {
    pushEvent({ name, meta });

    switch (name) {
      case EVENTS.SESSION_PROPOSAL:
        onSessionProposal(meta);
        break;
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
    onSessionProposal,
    onSessionRequest,
    onSessionDelete,
    eventHandler,
    client?.on,
  ]);
};

export default useWalletConnectEventsManager;
