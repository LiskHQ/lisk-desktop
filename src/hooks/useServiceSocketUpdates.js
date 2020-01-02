import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import liskService from '../utils/api/lsk/liskService';

const useServiceSocketUpdates = (event, initialState = false) => {
  const networkConfig = useSelector(state => state.network);
  const [isUpdateAvailable, setUpdateAvailable] = useState(initialState);
  const reset = () => setUpdateAvailable(initialState);

  useEffect(() => {
    const socket = io(
      `${liskService.getLiskServiceUrl(networkConfig)}/blockchain`,
      { transports: ['websocket'] },
    );
    socket.on(event, () => setUpdateAvailable(true));

    return function cleanUp() {
      socket.close();
    };
  }, [networkConfig.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
