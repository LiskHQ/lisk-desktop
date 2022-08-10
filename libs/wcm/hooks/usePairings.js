import { useEffect, useState } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';

const usePairings = (initialized) => {
  const [pairings, setPairings] = useState();

  const disconnect = async (topic) => {
    await client.disconnect({ topic, reason: getSdkError('USER_DISCONNECTED') });
    const newPairings = pairings.filter(pairing => pairing.topic !== topic);
    setPairings(newPairings);
  };

  const setUri = (uri) => {
    if (client?.pair && uri) {
      client.pair({ uri });
    }
  };

  useEffect(() => {
    if (initialized && !pairings) {
      const active = client.pairing.getAll({ active: true });
      setPairings(active);
    }
  }, [pairings, initialized]);

  return {
    pairings, setPairings, disconnect, setUri,
  };
};

export default usePairings;
