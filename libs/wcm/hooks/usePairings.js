import { useState, useEffect, useCallback, useContext } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { STATUS } from '../constants/lifeCycle';

export const usePairings = () => {
  const { pairings, setPairings, signClient } = useContext(ConnectionContext);
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Sets the pairing URI as an acknowledgement to the client.
   * Once the handshake is completed, the client will be able to
   * Request a pairing.
   *
   * @param {string} uri - The URI received from the web app.
   */
  const setUri = async (uri) => {
    try {
      const data = await signClient.core.pairing.pair({ uri });
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
  };

  const removePairing = useCallback(
    (topic) => {
      setPairings((prevPairings) => prevPairings.filter((pairing) => pairing.topic !== topic));
    },
    [setPairings]
  );

  const addPairing = useCallback(
    (pairing) => {
      setPairings((prevPairings) => [...prevPairings, pairing]);
    },
    [setPairings]
  );

  /**
   * Retrieves the active parings and refreshes the list.
   */
  const refreshPairings = useCallback(() => {
    const activePairings = signClient.pairing.getAll({ active: true });
    setPairings([...activePairings]);
  }, [signClient]);

  useEffect(() => {
    if (signClient?.pairing?.getAll && !pairings?.length && setPairings) {
      const activePairings = signClient.pairing.getAll({ active: true });
      setPairings([...activePairings]);
      setHasLoaded(true);
    }
  }, [signClient, setPairings]);

  return {
    hasLoaded,
    pairings,
    setUri,
    addPairing,
    removePairing,
    refreshPairings,
  };
};
