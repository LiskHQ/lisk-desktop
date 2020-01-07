import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import liskService from '../utils/api/lsk/liskService';

/**
 *
 * @param {object} event - Sock event data fired by Lisk Service
 * @returns {array} - [boolean, function]
 */
const useServiceSocketUpdates = (event) => {
  const networkConfig = useSelector(state => state.network);
  const [isUpdateAvailable, setUpdateAvailable] = useState(false);
  const reset = () => setUpdateAvailable(false);

  useEffect(() => {
    const cleanUp = liskService.listenToBlockchainEvents({
      networkConfig,
      event,
      callback: () => setUpdateAvailable(true),
    });

    return cleanUp;
  }, [networkConfig.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
