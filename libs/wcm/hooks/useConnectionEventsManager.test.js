import { renderHook } from '@testing-library/react-hooks';
import { client } from '@libs/wcm/utils/connectionCreator';
import { EVENTS } from '../constants/lifeCycle';
import { useConnectionEventsManager } from './useConnectionEventsManager';

const listeners = {};
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  client: {
    listeners,
    on: jest.fn().mockImplementation((name, listener) => {
      listeners[name] = listener;
    }),
    session: { get: jest.fn(topic => ({ topic })) },
  },
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

const mockDisconnect = jest.fn();
jest.mock('./usePairings', () => ({
  usePairings: () => ({
    disconnect: (...args) => mockDisconnect(...args),
  }),
}));

const pushEvent = jest.fn();
const setSession = jest.fn();
const session = { data: false, request: false };

describe('useConnectionEventsManager', () => {
  it('Binds listeners to wc events', () => {
    renderHook(() => useConnectionEventsManager({ pushEvent, session, setSession }));

    Object.keys(EVENTS).forEach((eventName) => {
      expect(client.on).toHaveBeenCalledWith(EVENTS[eventName], expect.any(Function));
    });
  });

  it('Pushes events into stack', () => {
    renderHook(() => useConnectionEventsManager({ pushEvent, session, setSession }));

    Object.keys(EVENTS).forEach((eventName) => {
      const event = {
        topic: '0x123',
      };
      client.listeners[EVENTS[eventName]](event);
      expect(pushEvent).toHaveBeenCalledWith({
        name: EVENTS[eventName],
        meta: event,
      });
    });
  });

  it('Stores the event and calls setSession on session request', () => {
    renderHook(() => useConnectionEventsManager({ pushEvent, session, setSession }));
    const event = {
      name: EVENTS.SESSION_REQUEST,
      meta: {
        topic: '0x123',
      },
    };

    // Trigger the event
    client.listeners[EVENTS.SESSION_REQUEST](event.meta);

    expect(setSession).toHaveBeenCalledWith({
      data: false,
      request: event.meta,
    });
  });

  it('Stores the event and calls disconnect on session delete', () => {
    renderHook(() => useConnectionEventsManager({ pushEvent, session, setSession }));
    const event = {
      name: EVENTS.SESSION_DELETE,
      meta: {
        topic: '0x123',
      },
    };

    // Trigger the event
    client.listeners[EVENTS.SESSION_DELETE](event.meta);

    expect(mockDisconnect).toHaveBeenCalledWith(event.meta.topic);
  });
});
