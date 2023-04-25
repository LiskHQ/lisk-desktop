import { useState, useEffect, useCallback, useContext } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { client } from '@libs/wcm/utils/connectionCreator';
import { STATUS } from '../constants/lifeCycle';

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
    hasLoaded,
    pairings,
    setUri,
    addPairing,
    setPairings,
    removePairing,
    refreshPairings,
  };
};
