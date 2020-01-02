import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import liskService from '../utils/api/lsk/liskService';

const useServiceSocketUpdates = (event, initialState = false) => {
  const networkConfig = useSelector(state => state.network);
  const [isUpdateAvailable, setUpdateAvailable] = useState(initialState);
  const reset = () => setUpdateAvailable(initialState);

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
