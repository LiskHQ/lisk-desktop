import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { useFakeTimers } from 'sinon';
import { MemoryRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import accounts from '../../../test/constants/accounts';
import TransactionRowV2 from './transactionRowV2';
import history from '../../history';

describe('TransactionRow V2', () => {
  let clock;

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

  const props = {
    value: rowData,
    address: '16313739661670634666L',
    followedAccounts: [],
  };

  const options = {
    context: { history },
    childContextTypes: {
      history: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    clock = useFakeTimers({
      now: new Date(2018, 1, 1),
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render 5 columns', () => {
    const wrapper = mount(<Router>
        <TransactionRowV2
          {...props} />
      </Router>, options);

    expect(wrapper.find('.transactions-cell')).to.have.lengthOf(5);
  });

  it('should not cause any error on click if props.onClick is not defined', () => {
    const wrapper = mount(<Router>
        <TransactionRowV2
          {...props} />
      </Router>, options);

    wrapper.find('.transactions-cell').at(0).simulate('click');
  });

  it('should render SpinnerV2 if no value.confirmations" ', () => {
    rowData.confirmations = undefined;
    const wrapper = mount(<Router>
        <TransactionRowV2
          {...props} />
      </Router>, options);
    expect(wrapper).to.have.className('pending');
    expect(wrapper.find('.status')).to.have.className('showSpinner');
  });

  it('should hide Spinner after first confirmation and timeout expires', () => {
    rowData.confirmations = undefined;
    const wrapper = mount(<Router>
        <TransactionRowV2
          {...props} />
      </Router>, options);
    expect(wrapper).to.have.className('pending');
    expect(wrapper.find('.status')).to.have.className('showSpinner');
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        value: {
          ...rowData,
          confirmations: 800,
        },
      }),
    });
    wrapper.update();
    clock.tick(2000);
    expect(wrapper).to.not.have.className('pending');
    expect(wrapper.find('.status')).to.have.className('showDate');
  });
});
