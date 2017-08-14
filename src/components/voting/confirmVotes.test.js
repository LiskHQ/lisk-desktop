import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import PropTypes from 'prop-types';
import sinonStubPromise from 'sinon-stub-promise';
import store from '../../store';
import ConfrimVotesContainer, { ConfirmVotes } from './confirmVotes';
import * as delegateApi from '../../utils/api/delegate';

sinonStubPromise(sinon);
chai.use(sinonChai);
chai.use(chaiEnzyme());

const props = {
  activePeer: {},
  account: {
    passphrase: 'pass',
    publicKey: 'key',
    secondSignature: 0,
  },
  votedList: [
    {
      username: 'yashar',
    },
    {
      username: 'tom',
    },
  ],
  unvotedList: [
    {
      username: 'john',
    },
    {
      username: 'test',
    },
  ],
  closeDialog: sinon.spy(),
  showSuccessAlert: sinon.spy(),
  clearVoteLists: sinon.spy(),
  pendingVotesAdded: sinon.spy(),
  addTransaction: sinon.spy(),
};
describe('ConfrimVotesContainer', () => {
  it('should render ConfrimVotes', () => {
    const wrapper = mount(<ConfrimVotesContainer {...props} store={store} />, {
      context: { store },
      childContextTypes: { store: PropTypes.object.isRequired },
    });
    expect(wrapper.find('ConfirmVotes').exists()).to.be.equal(true);
  });
});
describe('ConfrimVotes', () => {
  let wrapper;
  const delegateApiMock = sinon.stub(delegateApi, 'vote');
  beforeEach(() => {
    wrapper = mount(<ConfirmVotes {...props} />, {
      context: { store },
      childContextTypes: { store: PropTypes.object.isRequired },
    });
  });

  it('should call vote api when confirm button is pressed', () => {
    const clock = sinon.useFakeTimers();
    delegateApiMock.returnsPromise().resolves({ success: true });
    wrapper.instance().confirm();
    expect(props.pendingVotesAdded).to.have.been.calledWith();
    expect(props.addTransaction).to.have.been.calledWith();
    expect(props.showSuccessAlert).to.have.been.calledWith();
    // it should triger 'props.clearVoteLists' after 10000 ms
    clock.tick(10000);
    expect(props.clearVoteLists).to.have.been.calledWith();
  });

  it('should update state when "setSecondPass" is called', () => {
    wrapper.setProps({
      account: Object.assign(props.account, { secondSignature: 1 }),
    });
    wrapper.find('.secondSecret input').simulate('change', { target: { value: 'this is test' } });
    expect(wrapper.state('secondSecret')).to.be.equal('this is test');
  });
});

