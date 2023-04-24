import { useState, useEffect, useCallback, useContext } from 'react';
import { getSdkError } from '@walletconnect/utils';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { client } from '@libs/wcm/utils/connectionCreator';
import { ERROR_CASES, STATUS } from '../constants/lifeCycle';

export const usePairings = () => {
  const { pairings, setPairings } = useContext(ConnectionContext);
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Sets the pairing URI as an acknowledgement to the client.
   * Once the handshake is completed, the client will be able to
   * Request a pairing.
   *
   * @param {string} uri - The URI received from the web app.
   */
  const setUri = useCallback(
    async (uri) => {
      try {
        const data = await client.pair({ uri });
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
    },
    [client]
  );

  const removePairing = useCallback((topic) => {
    setPairings((prevPairings) => prevPairings.filter((pairing) => pairing.topic !== topic));
  }, [setPairings]);

  const addPairing = useCallback((pairing) => {
    setPairings((prevPairings) => [...prevPairings, pairing]);
  }, [setPairings]);
  /**
   * Disconnect a given pairing. Removes the pairing from context and the bridge.
   *
   * @param {string} topic - The pairing topic (Connection ID) to disconnect.
   */
  const disconnect = useCallback(
    async (topic) => {
      removePairing(topic);
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

  /**
   * Retrieves the active parings and refreshes the list.
   */
  const refreshPairings = useCallback(() => {
    const activePairings = client.pairing.getAll({ active: true });
    setPairings([...activePairings]);
  }, [client]);

  useEffect(() => {
    if (client?.pairing?.getAll && pairings?.length === 0 && setPairings) {
      const activePairings = client.pairing.getAll({ active: true });
      setPairings([...activePairings]);
      setHasLoaded(true);
    }
  }, [client, setPairings]);

  return {
    pairings,
    setUri,
    disconnect,
    addPairing,
    setPairings,
    removePairing,
    refreshPairings,
    hasLoaded,
  };
};
