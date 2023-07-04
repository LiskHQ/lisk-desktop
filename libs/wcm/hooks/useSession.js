import { useContext, useEffect, useCallback, useState } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';
import { formatJsonRpcResult } from '../utils/jsonRPCFormat';
import ConnectionContext from '../context/connectionContext';
import { onApprove, onReject } from '../utils/sessionHandlers';
import { EVENTS, STATUS, ERROR_CASES } from '../constants/lifeCycle';
import { useEvents } from './useEvents';

export const useSession = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const {
    events,
    sessions,
    sessionRequest,
    sessionProposal,
    setSessions,
    setSessionProposal,
    setSessionRequest,
  } = useContext(ConnectionContext);
  const { removeEvent } = useEvents();

  const loadSessions = useCallback(async () => {
    const loadedSessions = [];

    await Promise.all(
      client.session.keys.map(async (key, index) => {
        loadedSessions[index] = client.session.get(key);
      })
    );

    setHasLoaded(true);
    setSessions(loadedSessions);
  }, []);

  const approve = useCallback(async (selectedAccounts) => {
    const proposalEvents = events.find((e) => e.name === EVENTS.SESSION_PROPOSAL);
    try {
      const status = await onApprove(proposalEvents.meta, selectedAccounts);
      removeEvent(proposalEvents);
      setSessionProposal(null);
      setSessionRequest(null);
      await loadSessions();
      return {
        status,
        data: proposalEvents.meta,
      };
    } catch (e) {
      return {
        status: STATUS.FAILURE,
        message: e.message,
      };
    }
  }, []);

  const reject = useCallback(async () => {
    const proposalEvents = events.find((e) => e.name === EVENTS.SESSION_PROPOSAL);
    try {
      await onReject(proposalEvents.meta);
      setSessionProposal(null);
      setSessionRequest(null);
      return {
        status: STATUS.SUCCESS,
        data: proposalEvents.meta,
      };
    } catch (e) {
      return {
        status: STATUS.FAILURE,
        message: e.message,
      };
    }
  }, []);

  const respond = useCallback(async ({ payload }) => {
    const requestEvent = events.find((e) => e.name === EVENTS.SESSION_REQUEST);
    const topic = requestEvent.meta.topic;
    const response = formatJsonRpcResult(requestEvent.meta.id, payload);

    try {
      const data = await client.respond({
        topic,
        response,
      });
      return {
        status: STATUS.SUCCESS,
        data,
      };
    } catch (e) {
      return {
        status: STATUS.FAILURE,
        message: e.message,
      };
    }
  }, []);

  /**
   * Disconnect a given pairing. Removes the pairing from context and the bridge.
   *
   * @param {string} topic - The pairing topic (Connection ID) to disconnect.
   */
  const disconnect = useCallback(
    async (topic) => {
      setSessions((prevSessions) => prevSessions.filter((session) => session.topic !== topic));
      try {
        await client.disconnect({
          topic,
          reason: getSdkError(ERROR_CASES.USER_DISCONNECTED),
        });
        return {
          status: STATUS.SUCCESS,
        };
      } catch (e) {
        return {
          status: STATUS.FAILURE,
          message: e.message,
        };
      }
    },
    [client]
  );

  useEffect(() => {
    if (client?.session && !hasLoaded) {
      (async () => {
        await loadSessions();
      })();
    }
  }, [client, sessions]);

  return {
    hasLoaded,
    reject,
    approve,
    respond,
    sessions,
    sessionRequest,
    setSessions,
    sessionProposal,
    disconnect,
    setSessionRequest,
  };
};
