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
const votes = {
  username1: { publicKey: 'sample_key', confirmed: true, unconfirmed: false },
  username2: { publicKey: 'sample_key', confirmed: false, unconfirmed: true },
};
const delegates = [
  { username: 'username1', publicKey: '123HG3452245L' },
  { username: 'username2', publicKey: '123HG3522345L' },
];

const store = configureMockStore([])({
  account: ordinaryAccount,
  voting: {
    votes,
    delegates,
  },
  peers: { data: {} },
});
let props;

describe('VoteDialog', () => {
  let wrapper;
  props = {
    voted: [],
    activePeer: {},
    votes,
    delegates,
    closeDialog: sinon.spy(),
    votePlaced: sinon.spy(),
    voteToggled: sinon.spy(),
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
      wrapper.find('VoteDialog .primary-button button').simulate('submit');

      expect(props.votePlaced).to.have.been.calledWith({
        account: ordinaryAccount,
        passphrase: ordinaryAccount.passphrase,
        activePeer: props.activePeer,
        secondSecret: null,
        votes,
      });
    });

    it('should not fire votePlaced action if lists are empty', () => {
      const noVoteProps = {
        activePeer: {},
        votes: {},
        delegates: [],
        closeDialog: () => {},
        voteToggled: () => {},
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
      wrapper.instance().handleChange('secondPassphrase', secondPassphrase);
      wrapper.find('.primary-button button').simulate('submit');

      expect(props.votePlaced).to.have.been.calledWith({
        activePeer: props.activePeer,
        account: accountWithSecondPassphrase,
        votes,
        passphrase: accountWithSecondPassphrase.passphrase,
        secondSecret: secondPassphrase,
      });
    });
  });

  it('should not fire votePlaced action if the number of vote is higher than 33', () => {
    const extraVotes = {};
    for (let i = 0; i < 35; i++) {
      extraVotes[`standby_${i}`] = { confirmed: false, unconfirmed: true, publicKey: `public_key_${i}` };
    }
    const noVoteProps = Object.assign({}, props, { votes: extraVotes });
    const mounted = mount(<Provider store={store}>
      <VoteDialog {...noVoteProps} account={ordinaryAccount} /></Provider>);
    const primaryButton = mounted.find('VoteDialog .primary-button button');

    expect(primaryButton.props().disabled).to.be.equal(true);
  });
});
