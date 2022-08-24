import React, { useEffect, useContext } from 'react';
import { mount } from 'enzyme';
import ConnectionProvider from './connectionProvider';
import ConnectionContext from './connectionContext';
import { EVENTS } from '../constants/lifeCycle';

describe('connectionProvider', () => {
  it('Should mount a child with access to the default context', () => {
    const TestComponent = () => {
      const { session } = useContext(ConnectionContext);
      return (
        <div>
          {Object.keys(session).map(key => (<span key={key}>{key}</span>))}
        </div>
      );
    };
    const wrapper = mount(
      <ConnectionProvider>
        <TestComponent />
      </ConnectionProvider>,
    );
    expect(wrapper.find('span').at(0).text()).toBe('request');
    expect(wrapper.find('span').at(1).text()).toBe('data');
    expect(wrapper.find('span').at(2).text()).toBe('loaded');
  });

  it('Should update the context data using setters', () => {
    const TestComponent = () => {
      const {
        events, pushEvent, setPairings, pairings,
      } = useContext(ConnectionContext);
      useEffect(() => {
        pushEvent([{ name: EVENTS.SESSION_DELETE, meta: { session: { id: '1' } } }]);
        setPairings([{ id: '2' }]);
      }, []);
      return (
        <div>
          {events.map((event, i) => (<span key={i}>{event.name}</span>))}
          {pairings.map((p, i) => (<b key={i}>{p.id}</b>))}
        </div>
      );
    };
    const wrapper = mount(
      <ConnectionProvider>
        <TestComponent />
      </ConnectionProvider>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
    expect(wrapper.find('b')).toHaveLength(1);
  });
});
