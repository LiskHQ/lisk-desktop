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
    console.log('listen to', event, 'on', liskService.getLiskServiceUrl(networkConfig));
    socket.on(event, () => console.log('on event', event) || setUpdateAvailable(true));

    return function cleanUp() {
      console.log('close', event);
      socket.close();
    };
  }, [networkConfig.name]);

  return [isUpdateAvailable, reset];
};

export default useServiceSocketUpdates;
