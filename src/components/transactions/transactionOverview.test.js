import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import TransactionOverview from './transactionOverview';

describe('TransactionOverview', () => {
  it('should call transactionsRequested', () => {
    global.innerWidth = 500;

    const props = {
      loading: [],
      transactionsRequested: sinon.spy(),
      t: () => {},
      activePeer: '',
      address: 'https:localhost:8080',
      limit: 25,
      transactions: [{}],
      activeFilter: 1,
    };

    const output = {
      activePeer: props.activePeer,
      address: props.address,
      limit: props.limit,
      offset: undefined,
      filter: props.activeFilter,
    }

    const wrapper = shallow(<TransactionOverview {...props} />, { });
    // expect(props.transactionsRequested).to.have.been.calledWith({});
  });
});
