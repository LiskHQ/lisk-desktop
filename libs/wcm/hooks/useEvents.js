import { useContext } from 'react';
import ConnectionContext from '../context/connectionContext';

export const useEvents = () => {
  const { events, removeEvent, pushEvent } = useContext(ConnectionContext);

  return {
    events, removeEvent, pushEvent,
  };
};
