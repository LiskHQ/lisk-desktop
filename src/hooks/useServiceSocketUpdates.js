import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { subscribe } from '../utils/api/ws';

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
    const connection = subscribe(
      network.serviceUrl,
      event,
      () => setUpdateAvailable(true),
      () => {},
      () => {},
    );

    return () => { connection.close(); };
  }, [network.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
