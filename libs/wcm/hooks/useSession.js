import { useContext, useEffect, useCallback } from 'react';
import { formatJsonRpcResult } from '@json-rpc-tools/utils'
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { onApprove, onReject } from '../utils/sessionHandlers';
import usePairings from './usePairings';
import { EVENTS, PAIRING_PROPOSAL_STATUS } from '../constants/lifeCycle';

const useSession = () => {
  const { events, session, setSession } = useContext(ConnectionContext);
  const { refreshPairings } = usePairings();

  const approve = useCallback(async (selectedAccounts) => {
    let status = PAIRING_PROPOSAL_STATUS.FAILED;
    const proposalEvents = events.find(e => e.name === EVENTS.SESSION_PROPOSAL);
    if (proposalEvents) {
      setSession({
        ...session,
        request: false,
        data: proposalEvents.meta,
      });
      status = await onApprove(proposalEvents.meta, selectedAccounts);
      refreshPairings();
    }

    return status;
  }, []);

  const reject = useCallback(async () => {
    const proposalEvents = events.find(e => e.name === EVENTS.SESSION_PROPOSAL);
    if (proposalEvents) {
      setSession({ ...session, request: false });
      await onReject(proposalEvents.meta);
    }
  }, []);

  const respond = useCallback(async ({ payload }) => {
    const requestEvent = events.find(e => e.name === EVENTS.SESSION_REQUEST);
    const topic = requestEvent.meta.topic;
    const response = formatJsonRpcResult(requestEvent.meta.id, payload);
    await client.respond({
      topic,
      response
    })
  }, []);

  useEffect(() => {
    if (client?.session && !session.loaded) {
      const lastKeyIndex = client.session.keys.length - 1;
      const data = (lastKeyIndex === 0)
        ? client.session.get(client.session.keys[lastKeyIndex])
        : false;
      setSession({ ...session, loaded: true, data });
    }
  }, [client, session]);

  return {
    reject,
    approve,
    respond,
    session,
    setSession,
  };
};

export default useSession;
