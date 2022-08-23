import { useEffect, useContext } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { ERROR_CASES } from '../constants/lifeCycle';

const usePairings = () => {
  const { pairings, setPairings } = useContext(ConnectionContext);

  /**
   * Sets the pairing URI as an aknowledgement to the client.
   * Once the handshake is completed, the client will be able to
   * Request a pairing.
   *
   * @param {string} uri - The URI received from the web app.
   */
  const setUri = (uri) => {
    if (client?.pair && uri) {
      client.pair({ uri });
    }
  };

  const removePairing = (topic) => {
    const newPairings = pairings.filter(pairing => pairing.topic !== topic);
    // Also inform the bridge
    setPairings(newPairings);
  };

  const addPairing = (pairing) => {
    setPairings([...pairings, pairing]);
  };

  /**
   * Disconnect a given pairing. Removes the pairing from context and the bridge.
   *
   * @param {string} topic - The pairing topic (Connection ID) to disconnect.
   */
  const disconnect = async (topic) => {
    // @todo remove session if ID is the same as the current session
    removePairing(topic);
    await client.disconnect({ topic, reason: getSdkError(ERROR_CASES.USER_DISCONNECTED) });
  };

  /**
   * Retrieves the active parings and refreshes the list.
   */
  const refreshPairings = async () => {
    const activePairings = client.pairing.getAll({ active: true });
    setPairings([{ loaded: true }, ...activePairings]);
  };

  useEffect(() => {
    if (client?.pairing?.getAll && !pairings.length) {
      const activePairings = client.pairing.getAll({ active: true });
      setPairings([{ loaded: true }, ...activePairings]);
    }
  }, [client]);

  return {
    pairings,
    setUri,
    disconnect,
    addPairing,
    setPairings,
    removePairing,
    refreshPairings,
  };
};

export default usePairings;
