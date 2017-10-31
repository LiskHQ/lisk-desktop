import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import VotingHeader from './votingHeader';
import history from '../../history';
import i18n from '../../i18n';

describe('VotingHeader', () => {
  let wrapper;
  const voteDict = {
    username3: { confirmed: false, unconfirmed: true, publicKey: 'sample_key3' },
  };
  const unvoteDict = {
    username1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key1' },
  };
  const votes = Object.assign({}, voteDict, unvoteDict);

  const store = configureMockStore([])({
    peers: {
      data: {},
    },
    voting: {
      votes,
    },
    account: {},
  });

  const props = {
    votedDelegates: [
      {
        username: 'username1',
        address: 'address 1',
      },
      {
        username: 'username2',
        address: 'address 2',
      },
    ],
    setActiveDialog: sinon.spy(),
    voteToggled: sinon.spy(),
    addTransaction: sinon.spy(),
    search: sinon.spy(),
    t: key => key,
  };

  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  describe('Vote and Unvote', () => {
    beforeEach(() => {
      wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>, options);
    });

    it('should render an Input, a menuItem and a RelativeLink', () => {
      expect(wrapper.find('Input')).to.have.lengthOf(1);
      expect(wrapper.find('MenuItem')).to.have.lengthOf(1);
      expect(wrapper.find('RelativeLink')).to.have.lengthOf(1);
    });

    it('should render i#searchIcon with text of "search" when this.search is not called', () => {
      // expect(wrapper.find('i.material-icons')).to.have.lengthOf(1);
      expect(wrapper.find('#searchIcon').text()).to.be.equal('search');
    });

    it('should render i#searchIcon with text of "close" when this.search is called', () => {
      wrapper.find('.search input').simulate('change', { target: { value: '555' } });
      expect(wrapper.find('#searchIcon').text()).to.be.equal('close');
    });

    it('should this.props.search when this.search is called', () => {
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date'],
      });
      wrapper.find('.search input').simulate('change', { target: { value: '555' } });
      clock.tick(250);
      expect(props.search).to.have.been.calledWith('555');
    });

    it('click on #searchIcon should clear value of search input', () => {
      wrapper.find('Input.search input').simulate('change', { target: { value: '555' } });
      wrapper.update();
      expect(wrapper.find('Input.search input').props().value).to.be.equal('555');
      wrapper.find('i#searchIcon').simulate('click');
      wrapper.update();
      expect(wrapper.find('Input.search input').props().value).to.be.equal('');
    });
  });

  describe('Only vote', () => {
    beforeEach(() => {
      wrapper = mount(<Router><VotingHeader {...props} votes={voteDict} /></Router>, options);
    });

    it('should render vote button reflecting only (up)vote', () => {
      expect(wrapper.find('.vote-button-info').text()).to.be.equal('Vote (+1)');
    });
  });

  describe('Only unvote', () => {
    beforeEach(() => {
      wrapper = mount(<Router><VotingHeader {...props} votes={unvoteDict} /></Router>, options);
    });

    it('should render vote button reflecting only unvote', () => {
      expect(wrapper.find('.vote-button-info').text()).to.be.equal('Vote (-1)');
    });
  });

  describe('Without votes', () => {
    beforeEach(() => {
      wrapper = mount(<Router><VotingHeader {...props} votes={ {} } /></Router>, options);
    });

    it('should disable my votes button', () => {
      expect(wrapper.find('.my-votes-button button').hasClass('disableMenu__icon___2NDu1')).to.equal(true);
    });
  });
});
