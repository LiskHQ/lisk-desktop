import React from 'react';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import * as transactionsActions from '../../actions/transactions';
import * as dialogActions from '../../actions/dialog';
import store from '../../store';
import SecondPassphraseConnected, { SecondPassphrase } from './index';

chai.use(chaiEnzyme());
chai.use(sinonChai);

describe('SecondPassphrase', () => {
  let wrapper;

  const normalAccount = {
    isDelegate: false,
    address: '16313739661670634666L',
    balance: 1000e8,
  };

  const withSecondPassAccount = {
    isDelegate: true,
    address: '16313739661670634666L',
    balance: 1000e8,
    secondSignature: 'sample phrase',
  };

  const props = {
    peers: {},
    setActiveDialog: () => {},
    showSuccessAlert: () => {},
  };

  it('renders one MenuItem component for a normal account', () => {
    wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
      { account: normalAccount })} />);
    expect(wrapper.find('MenuItem')).to.have.length(1);
  });

  it('renders a list element for an account which already has a second passphrase', () => {
    wrapper = mount(<SecondPassphrase {...Object.assign({}, props,
      { account: withSecondPassAccount })} />);
    expect(wrapper.find('.empty-template')).to.have.length(1);
  });

  it('calls setActiveDialog when clicked', () => {
    const spiedProps = Object.assign({}, props, {
      account: normalAccount,
      setActiveDialog: sinon.spy(),
    });
    wrapper = mount(<SecondPassphrase {...spiedProps}/>);
    wrapper.find('MenuItem').simulate('click');
    expect(spiedProps.setActiveDialog).to.have.been.calledWith();
  });

  describe('SecondPassphraseConnected', () => {
    let childProps;
    store.getState = () => ({
      account: { secondSignature: 1 },
    });

    beforeEach(() => {
      wrapper = mount(<Provider store={store}><SecondPassphraseConnected /></Provider>);
      childProps = wrapper.find(SecondPassphrase).props();
    });

    it('should render SecondPassphrase', () => {
      expect(wrapper.find(SecondPassphrase)).to.have.lengthOf(1);
    });

    it('should bind dialogDisplayed action to SecondPassphrase props.setActiveDialog', () => {
      const actionsSpy = sinon.spy(dialogActions, 'dialogDisplayed');
      childProps.setActiveDialog({});
      expect(actionsSpy).to.be.calledWith();
      actionsSpy.restore();
    });

    it('should bind successAlertDialogDisplayed action to SecondPassphrase props.showSuccessAlert', () => {
      const actionsSpy = sinon.spy(dialogActions, 'successAlertDialogDisplayed');
      childProps.showSuccessAlert({});
      expect(actionsSpy).to.be.calledWith();
      actionsSpy.restore();
    });

    it('should bind transactionAdded action to SecondPassphrase props.addTransaction', () => {
      const actionsSpy = sinon.spy(transactionsActions, 'transactionAdded');
      childProps.addTransaction({});
      expect(actionsSpy).to.be.calledWith();
      actionsSpy.restore();
    });
  });
});
