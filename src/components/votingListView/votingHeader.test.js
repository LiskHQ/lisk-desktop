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

  const searchButton = '#searchIcon';
  const clearButton = '#cleanIcon';

  describe('Vote and Unvote', () => {
    beforeEach(() => {
    });

    it('should render an input, a unordered list', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>, options);
      expect(wrapper.find('input')).to.have.lengthOf(2);
      expect(wrapper.find('ul')).to.have.lengthOf(1);
    });

    it('should render a clean icon and a search icon', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>, options);
      // expect(wrapper.find('i.material-icons')).to.have.lengthOf(1);
      expect(wrapper.find(searchButton).exists()).to.be.equal(true);
      expect(wrapper.find(clearButton).exists()).to.be.equal(true);
    });

    it('should this.props.search when this.search is called', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>, options);
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date'],
      });
      wrapper.find('input').at(0).simulate('change', { nativeEvent: { target: { value: '555' } } });
      clock.tick(250);
      expect(props.search).to.have.been.calledWith('555');
      clock.restore();
    });

    it(`click on ${clearButton} should clear value of search input`, () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>, options);
      wrapper.find('input').at(0).simulate('change', { nativeEvent: { target: { value: '555' } } });
      wrapper.update();
      expect(wrapper.find('input').at(0).props().value).to.be.equal('555');
      wrapper.find(clearButton).at(0).simulate('click');
      wrapper.update();
      expect(wrapper.find('input').at(0).props().value).to.be.equal('');
    });
  });
});
