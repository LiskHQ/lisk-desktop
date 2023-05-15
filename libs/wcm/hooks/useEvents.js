import { useContext } from 'react';
import ConnectionContext from '../context/connectionContext';

export const useEvents = () => {
  const { events, setEvents } = useContext(ConnectionContext);

  const pushEvent = (event) => {
    setEvents([...events, event]);
  };

  const removeEvent = (event) => {
    const newEvents = events.filter((e) => e.name !== event.name);
    setEvents(newEvents);
  };

  return {
    events,
    removeEvent,
    pushEvent,
  };
};
