import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SaveAccountHOC from './index';
import * as savedAccounts from '../../actions/savedAccounts';


describe('SaveAccountHOC', () => {
  let wrapper;

  const account = {
    isDelegate: false,
    publicKey: 'sample_key',
    username: 'lisk-nano',
  };
  const peers = { data: {
    options: {
      address: 'http://localhost:4000',
      network: 'Custom node',
    },
  } };
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });

  beforeEach(() => {
    wrapper = mount(<SaveAccountHOC closeDialog={() => {}} t={(key => key)} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('should render SaveAccount', () => {
    expect(wrapper.find('SaveAccount')).to.have.lengthOf(1);
  });

  it('should bind accountSaved action to SaveAccount props.accountSaved', () => {
    const actionsSpy = sinon.spy(savedAccounts, 'accountSaved');
    wrapper.find('SaveAccount .save-account-button button').simulate('click');
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

