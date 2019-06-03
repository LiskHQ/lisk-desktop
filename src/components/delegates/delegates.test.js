import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import { prepareStore } from '../../../test/unit-test-utils/applicationInit';
import peersReducer from '../../store/reducers/peers';
import accountReducer from '../../store/reducers/account';
import votingReducer from '../../store/reducers/voting';
import Delegates from './delegates';
import history from '../../history';
import i18n from '../../i18n';

describe('Delegates', () => {
  let wrapper;
  const votes = {
    username1: { confirmed: true, unconfirmed: true, publicKey: 'sample_key' },
  };
  const store = prepareStore({
    peers: peersReducer,
    account: accountReducer,
    voting: votingReducer,
  }, [thunk]);

  const delegates = [
    {
      address: 'address 1',
      username: 'username1',
      publicKey: 'sample_key',
      serverPublicKey: 'sample_key',
      rank: 12,
    },
    {
      address: 'address 2',
      username: 'username2',
      publicKey: 'sample_key',
      serverPublicKey: 'sample_key',
      rank: 23,
    },
  ];
  const props = {
    refreshDelegates: false,
    delegates,
    totalDelegates: 10,
    votes,
    t: key => key,
    history: { location: { search: '' } },
    clearVotes: jest.fn(),
  };
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  it('should allow to enable and disable voting mode', () => {
    wrapper = mount(<Router><Delegates {...props} /></Router>, options);
    wrapper.find('.start-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(1);

    wrapper.find('.cancel-voting-button').at(0).simulate('click');
    expect(wrapper.find('.addedVotes')).to.have.lengthOf(0);
  });
});

