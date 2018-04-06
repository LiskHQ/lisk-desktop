import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import Voting from './voting';
import store from '../../store';
import history from '../../history';
import i18n from '../../i18n';

describe('Voting', () => {
  let wrapper;

  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
      rank: 12,
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
      rank: 23,
    },
  ];
  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };
  const props = {
    refreshDelegates: false,
    delegates,
    totalDelegates: 10,
    votes,
    t: key => key,
  };
  beforeEach(() => {
    wrapper = mount(<Router><Voting {...props}></Voting></Router>,
      {
        context: { store, history, i18n },
        childContextTypes: {
          store: PropTypes.object.isRequired,
          history: PropTypes.object.isRequired,
          i18n: PropTypes.object.isRequired,
        },
      },
    );
  });

  afterEach(() => {
    // Voting.prototype.setStatus.restore();
  });

  it('should render DelegateSidebar', () => {
    expect(wrapper.find('DelegateSidebar')).to.have.lengthOf(1);
  });

  it('should render DelegateList', () => {
    expect(wrapper.find('DelegateList')).to.have.lengthOf(1);
  });
});

