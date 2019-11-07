import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import liskService from '../utils/api/lsk/liskService';

const useServiceSocketUpdates = (networkConfig, event, initialState = false) => {
  networkConfig = { name: 'Custom node' }; // TODO get real networkConfig;
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
