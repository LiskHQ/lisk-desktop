import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import VoteDialog from './voteDialog';

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

describe('VoteDialog', () => {
  let wrapper;
  props = {
    activePeer: {},
    votedList,
    unvotedList,
    closeDialog: sinon.spy(),
    clearVoteLists: sinon.spy(),
    votePlaced: sinon.spy(),
    addedToVoteList: sinon.spy(),
    removedFromVoteList: sinon.spy(),
  };

  describe('Ordinary account', () => {
    beforeEach(() => {
      wrapper = mount(<Provider store={store}>
        <VoteDialog {...props} account={ordinaryAccount} /></Provider>);
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
      wrapper.find('VoteDialog .primary-button button').simulate('click');

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
        <VoteDialog {...noVoteProps} account={ordinaryAccount} /></Provider>);
      const primaryButton = mounted.find('VoteDialog .primary-button button');

      expect(primaryButton.props().disabled).to.be.equal(true);
    });
  });

  describe('Account with second passphrase', () => {
    it('should fire votePlaced action with the provided secondPassphrase', () => {
      wrapper = mount(<VoteDialog {...props} account={accountWithSecondPassphrase} />, {
        context: { store },
        childContextTypes: { store: PropTypes.object.isRequired },
      });
      const secondPassphrase = 'test second passphrase';
      wrapper.instance().setSecondPass('secondPassphrase', secondPassphrase);
      wrapper.find('.primary-button button').simulate('click');

      expect(props.votePlaced).to.have.been.calledWith({
        activePeer: props.activePeer,
        account: accountWithSecondPassphrase,
        votedList: props.votedList,
        unvotedList: props.unvotedList,
        secondSecret: secondPassphrase,
      });
    });
  });
});
