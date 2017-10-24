import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import tableStyle from 'react-toolbox/lib/table/theme.css';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import PropTypes from 'prop-types';
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
    senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    senderId: '16313739661670634666L',
    recipientId: '537318935439898807L',
    recipientPublicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
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

  it('should render 6 "td"', () => {
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
    expect(wrapper.find('td')).to.have.lengthOf(6);
  });

  it('should render Spinner if no value.confirmations" ', () => {
    rowData.confirmations = undefined;
    const wrapper = mount(<Provider store={store}>
      <Router>
        <I18nextProvider i18n={ i18n }>
          <TransactionRow tableStyle={tableStyle} address={address} value={rowData}>
          </TransactionRow>
        </I18nextProvider>
      </Router>
    </Provider>, options);
    expect(wrapper.find('Spinner')).to.have.lengthOf(1);
  });
});
