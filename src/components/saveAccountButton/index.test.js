import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
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
    wrapper = mount(<Router><SaveAccountButtonHOC theme={{}} /></Router>, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
    props = wrapper.find(SaveAccountButton).props();
  });

  it('should render the SaveAccountButton with props.successToast and props.setActiveDialog', () => {
    expect(wrapper.find(SaveAccountButton).exists()).to.equal(true);
    expect(props.account).to.equal(account);
    expect(props.savedAccounts).to.equal(savedAccounts);
    expect(typeof props.accountRemoved).to.equal('function');
  });
});

