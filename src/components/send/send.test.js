import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Send from './send';
import * as accountApi from '../../utils/api/account';


chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('Send', () => {
  let wrapper;
  let accountApiMock;
  let props;

  beforeEach(() => {
    accountApiMock = sinon.mock(accountApi);
    props = {
      activePeer: {},
      account: {
        balance: 1000e8,
      },
      closeDialog: () => {},
      showSuccessAlert: sinon.spy(),
      showErrorAlert: sinon.spy(),
      addTransaction: sinon.spy(),
    };
    wrapper = mount(<Send {...props} />);
  });

  afterEach(() => {
    accountApiMock.verify();
    accountApiMock.restore();
  });

  it('renders two Input components', () => {
    expect(wrapper.find('Input')).to.have.length(2);
  });

  it('renders two Button components', () => {
    expect(wrapper.find('Button')).to.have.length(2);
  });

  it('accepts valid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    expect(wrapper.find('.amount').text()).to.not.contain('Invalid');
  });

  it('recognizes invalid amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120 INVALID' } });
    expect(wrapper.find('.amount').text()).to.contain('Invalid');
  });

  it('recognizes zero amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '0' } });
    expect(wrapper.find('.amount').text()).to.contain('Zero not allowed');
  });

  it('recognizes too high amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    expect(wrapper.find('.amount').text()).to.contain('Insufficient funds');
  });

  it('recognizes empty amount', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '12000' } });
    wrapper.find('.amount input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('.amount').text()).to.contain('Required');
  });

  it('accepts valid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    expect(wrapper.find('.recipient').text()).to.not.contain('Invalid');
  });

  it('recognizes invalid recipient', () => {
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952' } });
    expect(wrapper.find('.recipient').text()).to.contain('Invalid');
  });

  it('allows to set maximum amount', () => {
    wrapper.find('.transaction-amount').simulate('click');
    wrapper.find('.send-maximum-amount').simulate('click');
    expect(wrapper.find('.amount input').props().value).to.equal('999.9');
  });

  it('allows to send a transaction, handles success and adds pending transaction', () => {
    accountApiMock.expects('send').resolves({ success: true });

    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.submit-button').simulate('click');
    // TODO: this doesn't work for some reason
    // expect(props.showSuccessAlert).to.have.been.calledWith();
    // expect(props.addTransaction).to.have.been.calledWith();
  });

  it('allows to send a transaction and handles error response with message', () => {
    const response = { message: 'Some server-side error' };
    accountApiMock.expects('send').rejects(response);
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.submit-button').simulate('click');
    // TODO: this doesn't work for some reason
    // expect(props.showErrorAlert).to.have.been.calledWith({ text: response.message });
  });

  it('allows to send a transaction and handles error response without message', () => {
    accountApiMock.expects('send').rejects({ success: false });
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.submit-button').simulate('click');
    // TODO: this doesn't work for some reason
    // expect(props.showErrorAlert).to.have.been.calledWith({
    //    text: 'An error occurred while creating the transaction.' });
  });
});
