import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import configureMockStore from 'redux-mock-store';
import sinonStubPromise from 'sinon-stub-promise';
import i18n from '../../i18n';
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
const delegates = [
  {
    username: 'yashar',
    publicKey: 'sample_key',
  },
  {
    username: 'tom',
    publicKey: 'sample_key',
  },
];
const votes = {
  john: { confirmed: false, unconfirmed: true, publicKey: 'sample_key' },
  yashar: { confirmed: true, unconfirmed: false, publicKey: 'sample_key' },

};
const store = configureMockStore([])({
  account: ordinaryAccount,
  voting: {
    votes,
    delegates,
  },
  peers: { data: {} },
});

describe('VoteDialog HOC', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <I18nextProvider i18n={ i18n }>
        <VoteDialogHOC voted={[]} />
      </I18nextProvider>
    </Provider>);
  });

  it('should render VoteDialog', () => {
    expect(wrapper.find('VoteDialog').exists()).to.be.equal(true);
  });

  it('should pass appropriate properties to VoteDialog', () => {
    const confirmVotesProps = wrapper.find('VoteDialog').props();

    expect(confirmVotesProps.votes).to.be.equal(votes);
    expect(confirmVotesProps.delegates).to.be.equal(delegates);
    expect(confirmVotesProps.account).to.be.equal(ordinaryAccount);
    expect(confirmVotesProps.activePeer).to.deep.equal({});
    expect(typeof confirmVotesProps.voteToggled).to.be.equal('function');
  });

  it('should bind voteToggled action to VoteDialog props.voteToggled', () => {
    const actionsSpy = sinon.spy(votingActions, 'voteToggled');
    wrapper.find('VoteDialog').props().voteToggled([]);
    expect(actionsSpy).to.be.calledWith();
  });
});
