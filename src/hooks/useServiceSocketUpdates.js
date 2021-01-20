import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { subscribe, unsubscribe } from '../utils/api/ws';

/**
 *
 * @param {object} event - Sock event data fired by Lisk Service
 * @returns {array} - [boolean, function]
 */
const useServiceSocketUpdates = (event) => {
  const serviceUrl = useSelector(state => state.network.networks[state.settings.token.active].serviceUrl);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const reset = () => setUpdateAvailable(false);

  useEffect(() => {
    subscribe(
      serviceUrl,
      event,
      () => setUpdateAvailable(true),
      () => {},
      () => {},
    );

    return () => { unsubscribe(event); };
  }, [serviceUrl]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
