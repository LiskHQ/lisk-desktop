import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { subscribe, unsubscribe } from '../utils/api/ws';

/**
 *
 * @param {object} event - Sock event data fired by Lisk Service
 * @returns {array} - [boolean, function]
 */
const useServiceSocketUpdates = (event) => {
  const network = useSelector(state => state.network);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const reset = () => setUpdateAvailable(false);

  useEffect(() => {
    subscribe(
      network.serviceUrl,
      event,
      () => setUpdateAvailable(true),
      () => {},
      () => {},
    );

    return () => { unsubscribe(event); };
  }, [network.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
