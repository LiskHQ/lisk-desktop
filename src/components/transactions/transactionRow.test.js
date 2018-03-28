import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import PropTypes from 'prop-types';

import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import TransactionRow from './transactionRow';
import history from '../../history';

describe('TransactionRow', () => {
  const store = configureMockStore([])({});
  const rowData = {
    id: '1038520263604146911',
    height: 5,
    blockId: '12520699228609837463',
    type: 0,
    timestamp: 35929631,
    senderPublicKey: accounts.genesis.publicKey,
    senderId: accounts.genesis.address,
    recipientId: accounts.delegate.address,
    recipientPublicKey: accounts.delegate.publicKey,
    amount: 464000000000,
    fee: 10000000,
    signature: '3d276c1cb00edbc803e8911033727fe4a77f931868f89dc2f42deeefd7aa2eef1a58cd289517546ac3135f804499d1406234597d5b6198c4b9dac373c2b1bd03',
    signatures: [],
    confirmations: 892,
    asset: {},
  };
  const address = '16313739661670634666L';

  const options = {
    context: { store, history },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    },
  };

  it('should render 4 columns', () => {
    const wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <TransactionRow
            tableStyle={tableStyle}
            address={address}
            value={rowData}
            nextStep={() => {}}
          ></TransactionRow>
        </I18nextProvider>
      </Router>
    </Provider>, options);

    expect(wrapper.find('.transactions-cell')).to.have.lengthOf(4);
  });

  it('should not cause any error on click if props.onClick is not defined', () => {
    const wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <TransactionRow
            tableStyle={tableStyle}
            address={address}
            value={rowData}
          ></TransactionRow>
        </I18nextProvider>
      </Router>
    </Provider>, options);

    wrapper.find('.transactions-cell').at(0).simulate('click');
  });

  it('should render Spinner if no value.confirmations" ', () => {
    rowData.confirmations = undefined;
    const wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <TransactionRow
            tableStyle={tableStyle}
            address={address}
            value={rowData}
            nextStep={() => {}}>
          </TransactionRow>
        </I18nextProvider>
      </Router>
    </Provider>, options);
    expect(wrapper.find('Spinner')).to.have.lengthOf(1);
  });
});
