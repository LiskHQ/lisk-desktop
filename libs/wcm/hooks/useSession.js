import { useContext, useEffect, useCallback, useState } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { formatJsonRpcResult } from '../utils/jsonRPCFormat';
import ConnectionContext from '../context/connectionContext';
import { onApprove, onReject } from '../utils/sessionHandlers';
import { EVENTS, STATUS, ERROR_CASES } from '../constants/lifeCycle';
import { useEvents } from './useEvents';

export const useSession = ({ isEnabled = true } = {}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const {
    events,
    sessions,
    sessionRequest,
    sessionProposal,
    setSessions,
    setSessionProposal,
    setSessionRequest,
    signClient,
  } = useContext(ConnectionContext);
  const { removeEvent } = useEvents();

  const loadSessions = useCallback(async () => {
    const loadedSessions = [];

    await Promise.all(
      signClient.session.keys.map(async (key, index) => {
        loadedSessions[index] = signClient.session.get(key);
      })
    );

    setHasLoaded(true);
    setSessions(loadedSessions);
  }, []);

  const approve = useCallback(async (selectedAccounts) => {
    const proposalEvents = events.find((e) => e.name === EVENTS.SESSION_PROPOSAL);
    try {
      const status = await onApprove(proposalEvents.meta, selectedAccounts, signClient);
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

  const reject = useCallback(async (event) => {
    const proposalEvents = event || events.find((e) => e.name === EVENTS.SESSION_PROPOSAL);
    try {
      await onReject(proposalEvents.meta, signClient);
      removeEvent(proposalEvents);
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

  const respond = useCallback(async ({ payload, event }) => {
    const requestEvent = event || events.find((e) => e.name === EVENTS.SESSION_REQUEST);
    const topic = requestEvent.meta.topic;
    const response = formatJsonRpcResult(requestEvent.meta.id, payload);

    try {
      const data = await signClient.respond({
        topic,
        response,
      });
      setSessionRequest(null);
      removeEvent(requestEvent);
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
   */
  const disconnect = useCallback(
    async (topic) => {
      setSessions((prevSessions) => prevSessions.filter((session) => session.topic !== topic));
      try {
        await signClient.disconnect({
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
    [signClient]
  );

  useEffect(() => {
    if (signClient?.session && !hasLoaded && isEnabled) {
      (async () => {
        await loadSessions();
      })();
    }
  }, [signClient, sessions, isEnabled]);

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
