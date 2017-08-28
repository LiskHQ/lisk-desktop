import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import ConfirmVotesHOC, { ConfirmVotes } from './confirmVotes';

const ordinaryAccount = {
  passphrase: 'pass',
  publicKey: 'key',
  secondSignature: 0,
  balance: 10e8,
};
const accountWithSecondPassphrase = {
  passphrase: 'pass',
  publicKey: 'key',
  secondSignature: 1,
};
const votedList = [
  {
    username: 'yashar',
  },
  {
    username: 'tom',
  },
];
const unvotedList = [
  {
    username: 'john',
  },
  {
    username: 'test',
  },
];
const store = configureMockStore([])({
  account: ordinaryAccount,
  voting: {
    votedList,
    unvotedList,
  },
  peers: { data: {} },
});
let props;

describe('ConfirmVotes', () => {
  let wrapper;
  props = {
    activePeer: {},
    votedList,
    unvotedList,
    closeDialog: sinon.spy(),
    clearVoteLists: sinon.spy(),
    votePlaced: sinon.spy(),
  };

  describe('Ordinary account', () => {
    beforeEach(() => {
      wrapper = mount(<Provider store={store}>
        <ConfirmVotes {...props} account={ordinaryAccount} /></Provider>);
    });

    it('should render an InfoParagraph', () => {
      expect(wrapper.find('InfoParagraph')).to.have.lengthOf(1);
    });

    it('should render Autocomplete', () => {
      expect(wrapper.find('VoteAutocomplete')).to.have.lengthOf(1);
    });

    it('should render an ActionBar', () => {
      expect(wrapper.find('ActionBar')).to.have.lengthOf(1);
    });

    it('should fire votePlaced action if lists are not empty and account balance is sufficient', () => {
      wrapper.find('ConfirmVotes .primary-button button').simulate('click');

      expect(props.votePlaced).to.have.been.calledWith({
        account: ordinaryAccount,
        activePeer: props.activePeer,
        secondSecret: null,
        unvotedList: props.unvotedList,
        votedList: props.votedList,
      });
    });

    it('should not fire votePlaced action if lists are empty', () => {
      const noVoteProps = {
        activePeer: {},
        votedList: [],
        unvotedList: [],
        closeDialog: () => {},
        clearVoteLists: () => {},
        votePlaced: () => {},
      };
      const mounted = mount(<Provider store={store}>
        <ConfirmVotes {...noVoteProps} account={ordinaryAccount} /></Provider>);
      const primaryButton = mounted.find('ConfirmVotes .primary-button button');

      expect(primaryButton.props().disabled).to.be.equal(true);
    });
  });

  describe('Account with second passphrase', () => {
    beforeEach(() => {
      wrapper = mount(<Provider store={store}><ConfirmVotes
        {...props} account={accountWithSecondPassphrase} /></Provider>);
    });

    it('should render secondPassphrase input', () => {
      expect(wrapper.find('.second-passphrase')).to.have.lengthOf(1);
    });

    it('should fire votePlaced action with the provided secondPassphrase', () => {
      wrapper.find('ConfirmVotes .second-passphrase input').simulate('change',
        { target: { value: 'test second passphrase' } });
      wrapper.find('ConfirmVotes .primary-button button').simulate('click');

      expect(props.votePlaced).to.have.been.calledWith({
        account: ordinaryAccount,
        activePeer: props.activePeer,
        secondSecret: null,
        unvotedList: props.unvotedList,
        votedList: props.votedList,
      });
    });
  });
});

describe('ConfirmVotes HOC', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Provider store={store}><ConfirmVotesHOC /></Provider>);
  });

  it('should render ConfirmVotes', () => {
    expect(wrapper.find('ConfirmVotes').exists()).to.be.equal(true);
  });

  it('should pass appropriate properties to ConfirmVotes', () => {
    const confirmVotesProps = wrapper.find('ConfirmVotes').props();

    expect(confirmVotesProps.votedList).to.be.equal(votedList);
    expect(confirmVotesProps.unvotedList).to.be.equal(unvotedList);
    expect(confirmVotesProps.account).to.be.equal(ordinaryAccount);
    expect(confirmVotesProps.activePeer).to.deep.equal({});
    expect(typeof confirmVotesProps.votePlaced).to.be.equal('function');
  });
});
