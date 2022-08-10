import { useCallback, useEffect } from 'react';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { client } from '@libs/wcm/utils/connectionCreator';
import { LISK_SIGNING_METHODS } from '../data/chainConfig';

const useWalletConnectEventsManager = (history, pairings, setPairings) => {
  const onSessionProposal = useCallback((proposal) => {
    // @todo pass the proposal to the modal
    addSearchParamsToUrl(history, { modal: 'connectionSummary' });
  }, []);

  const onSessionRequest = useCallback(async (requestEvent) => {
    const { topic, params } = requestEvent;
    const { request } = params;
    const requestSession = client.session.get(topic);

    switch (request.method) {
      case LISK_SIGNING_METHODS.LISK_SIGN_MESSAGE:
      case LISK_SIGNING_METHODS.LISK_SIGN_TRANSACTION:
        // @todo pass the requestSession to the modal
        addSearchParamsToUrl(history, { modal: 'requestSummary' });
        break;
      default:
        // @todo Notify the user about the unknown request. Enable them to disconnect.
        console.log('Unknown request');
        break;
    }
  }, []);

  const onCustomEvent = useCallback((session) => {
    // @todo Assess the custom event and react accordingly.
    console.log('event', session);
  }, []);

  const onSessionPing = useCallback((session) => {
    // @todo Notify the user that the session was pinged.
    console.log('ping', session);
  }, []);

  const onSessionUpdate = useCallback((session) => {
    // @todo Notify the user that the session was updated.
    console.log('update', session);
  }, []);

  const onSessionDelete = useCallback((session) => {
    // @todo Access pairings from Context
    const newPairings = pairings.filter(pairing => pairing.topic !== session.topic);
    setPairings(newPairings);
  }, []);

  useEffect(() => {
    if (pairings) {
      client.on('session_proposal', onSessionProposal);
      client.on('session_request', onSessionRequest);
      client.on('session_ping', onSessionPing);
      client.on('session_event', onCustomEvent);
      client.on('session_update', onSessionUpdate);
      client.on('session_delete', onSessionDelete);
    }
  }, [
    onSessionProposal,
    onSessionRequest,
    onSessionPing,
    onCustomEvent,
    onSessionUpdate,
    onSessionDelete,
    pairings,
  ]);
};

export default useWalletConnectEventsManager;
