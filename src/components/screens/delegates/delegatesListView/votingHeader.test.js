import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import VotingHeader from './votingHeader';

describe('VotingHeader', () => {
  const voteDict = {
    username3: { confirmed: false, unconfirmed: true, publicKey: 'sample_key3' },
  };
  const unvoteDict = {
    username1: { confirmed: true, unconfirmed: false, publicKey: 'sample_key1' },
  };
  const votes = { ...voteDict, unvoteDict };

  const props = {
    account: {},
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
    voteToggled: sinon.spy(),
    addTransaction: sinon.spy(),
    search: sinon.spy(),
    t: key => key,
  };

  const searchButton = '#searchIcon';
  const clearButton = '#cleanIcon';

  describe('Vote and Unvote', () => {
    beforeEach(() => {
    });

    it('should render an input, a unordered list', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>);
      expect(wrapper.find('input')).to.have.lengthOf(2);
      expect(wrapper.find('ul')).to.have.lengthOf(1);
    });

    it('should render a clean icon and a search icon', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>);
      // expect(wrapper.find('i.material-icons')).to.have.lengthOf(1);
      expect(wrapper.find(searchButton).exists()).to.be.equal(true);
      expect(wrapper.find(clearButton).exists()).to.be.equal(true);
    });

    it('should this.props.search when this.search is called', () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>);
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'Date'],
      });
      wrapper.find('input').at(0).simulate('change', { nativeEvent: { target: { value: '555' } } });
      clock.tick(250);
      expect(props.search).to.have.been.calledWith('555');
      clock.restore();
    });

    it(`click on ${clearButton} should clear value of search input`, () => {
      const wrapper = mount(<Router><VotingHeader {...props} votes={votes} /></Router>);
      wrapper.find('input').at(0).simulate('change', { nativeEvent: { target: { value: '555' } } });
      wrapper.update();
      expect(wrapper.find('input').at(0).props().value).to.be.equal('555');
      wrapper.find(clearButton).at(0).simulate('click');
      wrapper.update();
      expect(wrapper.find('input').at(0).props().value).to.be.equal('');
    });
  });
});
