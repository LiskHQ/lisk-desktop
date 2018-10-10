import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import ConfirmVotesHOC from './index';
import history from '../../history';
import i18n from '../../i18n';
import * as votingActions from '../../actions/voting';

describe('ConfirmVotesHOC', () => {
  let wrapper;
  const account = {
    passphrase: 'pass',
    publicKey: 'key',
    secondSignature: 0,
    balance: 10e8,
  };
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
    passphrase: {
      value: 'giraffe laugh math dash chalk butter ghost report truck interest merry lens',
    },
    secondPassphrase: {
      value: 'giraffe laugh math dash chalk butter ghost report truck interest merry lens',
    },
    goToNextStep: sinon.spy(),
    t: key => key,
  };
  const peers = {
    data: {},
    options: {},
  };

  const store = configureMockStore([])({
    peers,
    voting: {
      delegates,
      votes,
    },
    account,
  });
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(
<Router><ConfirmVotesHOC store={store} {...props}></ConfirmVotesHOC></Router>,
options,
    );
  });

  afterEach(() => {
    // Voting.prototype.setStatus.restore();
  });

  it('should render ConfirmVotes', () => {
    expect(wrapper.find('ConfirmVotes')).to.have.lengthOf(1);
  });

  it.skip('should click to confirm button call votePlaced', () => {
    const votePlacedSpy = sinon.spy(votingActions, 'votePlaced');

    wrapper.find('button.confirm').simulate('click');
    votePlacedSpy.restore();
    expect(votePlacedSpy).to.be.calledWith();
  });
});
