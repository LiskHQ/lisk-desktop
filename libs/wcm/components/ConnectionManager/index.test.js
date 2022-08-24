import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react-hooks';
import flushPromises from '@tests/unit-test-utils/flushPromises';
import ConnectionManager from './index';
import { createSignClient } from '../../utils/connectionCreator';
import useWalletConnectEventsManager from '../../hooks/useConnectionEventsManager';

jest.mock('../../hooks/useConnectionEventsManager');
jest.mock('../../utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
}));

describe('ConnectionManager', () => {
  useWalletConnectEventsManager.mockImplementation(key => key);

  it('Should call the event manager hook', () => {
    mount(<ConnectionManager />);
    expect(useWalletConnectEventsManager).toHaveBeenCalled();
  });

  it('Should call createSignClient only at mount time', async () => {
    const wrapper = mount(<ConnectionManager />);
    act(() => {
      wrapper.setProps({ some: 'text' });
    });
    flushPromises();
    expect(createSignClient).toHaveBeenCalled();
  });
});
