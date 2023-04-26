import React from 'react';
import { render } from '@testing-library/react';
import { client } from '@libs/wcm/utils/connectionCreator';
import { EVENTS } from '../constants/lifeCycle';
import { useSession } from '../hooks/useSession';
import { useEvents } from '../hooks/useEvents';
import { ConnectionEventsManagerWrapper } from './ConnectionEventsManagerWrapper';

const listeners = {};
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  client: {
    listeners,
    on: jest.fn().mockImplementation((name, listener) => {
      listeners[name] = listener;
    }),
    session: { get: jest.fn((topic) => ({ topic })) },
  },
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

const pushEvent = jest.fn();
const setSessions = jest.fn();
const setSessionRequest = jest.fn();
jest.mock('../hooks/useSession');
jest.mock('../hooks/useEvents');
useEvents.mockReturnValue({
  pushEvent,
});
useSession.mockReturnValue({
  setSessionRequest,
  setSessions,
});

describe('useConnectionEventsManager', () => {
  it('Binds listeners to wc events', () => {
    render(
      <ConnectionEventsManagerWrapper>
        <span />
      </ConnectionEventsManagerWrapper>
    );

    Object.keys(EVENTS).forEach((eventName) => {
      expect(client.on).toHaveBeenCalledWith(EVENTS[eventName], expect.any(Function));
    });
  });

  it('Pushes events into stack', () => {
    render(
      <ConnectionEventsManagerWrapper>
        <span />
      </ConnectionEventsManagerWrapper>
    );

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
    render(
      <ConnectionEventsManagerWrapper>
        <span />
      </ConnectionEventsManagerWrapper>
    );
    const event = {
      name: EVENTS.SESSION_REQUEST,
      meta: {
        topic: '0x123',
      },
    };

    // Trigger the event
    client.listeners[EVENTS.SESSION_REQUEST](event.meta);

    expect(setSessions).toHaveBeenCalled();
  });

  it('Stores the event and calls disconnect on session delete', () => {
    render(
      <ConnectionEventsManagerWrapper>
        <span />
      </ConnectionEventsManagerWrapper>
    );
    const event = {
      name: EVENTS.SESSION_DELETE,
      meta: {
        topic: '0x123',
      },
    };

    // Trigger the event
    client.listeners[EVENTS.SESSION_DELETE](event.meta);

    expect(setSessions).toHaveBeenCalled();
  });
});
