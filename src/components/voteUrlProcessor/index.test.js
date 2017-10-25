import PropTypes from 'prop-types';
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import i18n from '../../i18n'; // initialized i18next instance
import * as votingActions from '../../actions/voting';
import VoteUrlProcessor from './voteUrlProcessor';
import VoteUrlProcessorHOC from './index';


describe('VoteUrlProcessorHOC', () => {
  let wrapper;
  const actionData = {
    dummy: 'dummy',
  };
  const state = {
    peers: { data: {} },
    account: {},
    voting: {
      voteLookupStatus: {
        delegate_name: 'pending',
      },
    },
  };
  const store = configureMockStore([])(state);
  const options = {
    context: { i18n, store },
    childContextTypes: {
      i18n: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
    },
  };

  beforeEach(() => {
    wrapper = mount(<Router><VoteUrlProcessorHOC /></Router>, options);
  });

  it('should render VoteUrlProcessor', () => {
    expect(wrapper.find(VoteUrlProcessor)).to.have.lengthOf(1);
  });

  it('should bind urlVotesFound action to VoteUrlProcessor props.urlVotesFound', () => {
    const actionMock = sinon.mock(votingActions);
    actionMock.expects('urlVotesFound').withExactArgs(actionData).returns({ type: 'DUMMY' });
    wrapper.find(VoteUrlProcessor).props().urlVotesFound(actionData);
    actionMock.restore();
  });

  it('should bind voteLookupStatusCleared action to VoteUrlProcessor props.clearVoteLookupStatus', () => {
    const actionsSpy = sinon.spy(votingActions, 'voteLookupStatusCleared');
    wrapper.find(VoteUrlProcessor).props().clearVoteLookupStatus();
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});

