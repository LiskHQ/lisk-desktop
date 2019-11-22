import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import TransactionsMonitor from './index';

jest.mock('../../../../constants/monitor', () => ({ DEFAULT_LIMIT: 4 }));
const fakeStore = configureStore();

describe('Transactions monitor page', () => {
  it('should render NotAvailable when using Custom Node', () => {
    const store = fakeStore({
      network: {
        name: 'Custom Node',
      },
    });
    const wrapper = mount(<Provider store={store}><TransactionsMonitor /></Provider>);
    expect(wrapper.find('NotAvailable')).toHaveLength(1);
  });
  it('should render Transactions when using testnet', () => {
    const store = fakeStore({
      network: {
        name: 'Testnet',
      },
    });
    const wrapper = mount(<Provider store={store}><TransactionsMonitor /></Provider>);
    expect(wrapper.find('NotAvailable')).toHaveLength(0);
  });
});
