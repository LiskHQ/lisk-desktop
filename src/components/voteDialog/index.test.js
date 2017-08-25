import React from 'react';
import { Provider } from 'react-redux';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureMockStore from 'redux-mock-store';
import sinonStubPromise from 'sinon-stub-promise';
import * as votingActions from '../../actions/voting';
import VoteDialogHOC from './index';
// import * as delegateApi from '../../utils/api/delegate';

sinonStubPromise(sinon);
chai.use(sinonChai);
chai.use(chaiEnzyme());

const ordinaryAccount = {
  passphrase: 'pass',
  publicKey: 'key',
  secondSignature: 0,
  balance: 10e8,
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

describe('VoteDialog HOC', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Provider store={store}><VoteDialogHOC /></Provider>);
  });

  it('should render VoteDialog', () => {
    expect(wrapper.find('VoteDialog').exists()).to.be.equal(true);
  });

  it('should pass appropriate properties to VoteDialog', () => {
    const confirmVotesProps = wrapper.find('VoteDialog').props();

    expect(confirmVotesProps.votedList).to.be.equal(votedList);
    expect(confirmVotesProps.unvotedList).to.be.equal(unvotedList);
    expect(confirmVotesProps.account).to.be.equal(ordinaryAccount);
    expect(confirmVotesProps.activePeer).to.deep.equal({});
    expect(typeof confirmVotesProps.votePlaced).to.be.equal('function');
  });

  it('should bind addedToVoteList action to VoteDialog props.addedToVoteList', () => {
    const actionsSpy = sinon.spy(votingActions, 'addedToVoteList');
    wrapper.find('VoteDialog').props().addedToVoteList([]);
    expect(actionsSpy).to.be.calledWith();
  });

  it('should bind removedFromVoteList action to VoteDialog props.removedFromVoteList', () => {
    const actionsSpy = sinon.spy(votingActions, 'removedFromVoteList');
    wrapper.find('VoteDialog').props().removedFromVoteList([]);
    expect(actionsSpy).to.be.calledWith();
  });
});
