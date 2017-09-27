import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import SaveAccountButtonHOC from './index';
import SaveAccountButton from './saveAccountButton';

describe('SaveAccountButtonHOC', () => {
  let props;
  let wrapper;

  const account = {
    isDelegate: false,
    publicKey: 'sample_key',
    username: 'lisk-nano',
  };
  const savedAccounts = [];
  const store = configureMockStore([])({
    savedAccounts,
    account,
    activePeerSet: () => {},
  });

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Router><SaveAccountButtonHOC /></Router></Provider>);
    props = wrapper.find(SaveAccountButton).props();
  });

  it('should render the SaveAccountButton with props.successToast and props.setActiveDialog', () => {
    expect(wrapper.find(SaveAccountButton).exists()).to.equal(true);
    expect(props.account).to.equal(account);
    expect(props.savedAccounts).to.equal(savedAccounts);
    expect(typeof props.accountRemoved).to.equal('function');
  });
});

