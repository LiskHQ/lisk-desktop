import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Provider } from 'react-redux';
import store from '../../store';
import Send from './send';


chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('Send', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      activePeer: {},
      account: {
        balance: 1000e8,
      },
      closeDialog: () => {},
      sent: sinon.spy(),
    };
    wrapper = mount(<Provider store={store}><Send {...props} /></Provider>);
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

  it('allows to send a transaction', () => {
    wrapper.find('.amount input').simulate('change', { target: { value: '120.25' } });
    wrapper.find('.recipient input').simulate('change', { target: { value: '11004588490103196952L' } });
    wrapper.find('.primary-button button').simulate('click');
    expect(props.sent).to.have.been.calledWith({
      account: { balance: 100000000000 },
      activePeer: {},
      amount: '120.25',
      passphrase: undefined,
      recipientId: '11004588490103196952L',
      secondPassphrase: null,
    });
  });
});
