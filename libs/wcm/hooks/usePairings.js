import { useEffect, useContext } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '../context/connectionContext';
import { ERROR_CASES } from '../constants/lifeCycle';

const usePairings = (initialized) => {
  const {
    pairings,
    setPairings,
    addPairing,
    removePairing,
  } = useContext(ConnectionContext);
  const disconnect = async (topic) => {
    await client.disconnect({ topic, reason: getSdkError(ERROR_CASES.USER_DISCONNECTED) });
    removePairing(topic);
  };

  const setUri = (uri) => {
    if (client?.pair && uri) {
      client.pair({ uri });
    }
  };

  const refreshPairings = async () => {
    const activePairings = client.pairing.getAll({ active: true });
    setPairings([{ loaded: true }, ...activePairings]);
  };

  useEffect(() => {
    if (initialized && !pairings.length) {
      const activePairings = client.pairing.getAll({ active: true });
      setPairings([{ loaded: true }, ...activePairings]);
    }
  }, [initialized]);

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
