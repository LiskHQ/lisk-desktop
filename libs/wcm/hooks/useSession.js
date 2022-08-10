import { useEffect, useState } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';

const useSession = (initialized) => {
  const [session, setSession] = useState();
  useEffect(() => {
    if (initialized && !session) {
      const lastKeyIndex = client.session.keys.length - 1;
      const data = (lastKeyIndex === 0)
        ? client.session.get(client.session.keys[lastKeyIndex])
        : false;
      setSession(data);
    }
  }, [session, initialized]);
  return { session, setSession };
};

export default useSession;
