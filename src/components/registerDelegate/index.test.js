import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as accountActions from '../../actions/account';
import * as transactionsActions from '../../actions/transactions';
import * as dialogActions from '../../actions/dialog';
import store from '../../store';
import RegisterDelegate from './index';

describe('RegisterDelegate HOC', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><RegisterDelegate closeDialog={() => {}} /></Provider>);
    props = wrapper.find('RegisterDelegate').props();
  });

  it('should render RegisterDelegate', () => {
    expect(wrapper.find('RegisterDelegate')).to.have.lengthOf(1);
  });

  it('should mount registerDelegate with appropriate properties', () => {
    expect(typeof props.closeDialog).to.be.equal('function');
  });

  it('should bind accountUpdated action to AccountComponent props.onAccountUpdated', () => {
    const actionsSpy = sinon.spy(accountActions, 'accountUpdated');
    props.onAccountUpdated({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind successAlertDialogDisplayed action to AccountComponent props.showSuccessAlert', () => {
    const actionsSpy = sinon.spy(dialogActions, 'successAlertDialogDisplayed');
    props.showSuccessAlert({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind errorAlertDialogDisplayed action to AccountComponent props.showErrorAlert', () => {
    const actionsSpy = sinon.spy(dialogActions, 'errorAlertDialogDisplayed');
    props.showErrorAlert({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind transactionAdded action to AccountComponent props.addTransaction', () => {
    const actionsSpy = sinon.spy(transactionsActions, 'transactionAdded');
    props.addTransaction({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
