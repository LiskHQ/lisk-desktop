import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as transactionsActions from '../../actions/transactions';
import TransactionsConnected from './index';
import store from '../../store';


describe('TransactionsConnected', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><TransactionsConnected /></Provider>);
  });

  it('should render Transactions', () => {
    expect(wrapper.find('Transactions')).to.have.lengthOf(1);
  });

  it('should bind transactionsLoaded action to Transactions props.transactionsLoaded', () => {
    const actionsSpy = sinon.spy(transactionsActions, 'transactionsLoaded');
    wrapper.find('Transactions').props().transactionsLoaded({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

