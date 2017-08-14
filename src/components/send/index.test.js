import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as dialogActions from '../../actions/dialog';
import * as transactionsActions from '../../actions/transactions';
import SendContainer from './';
import store from '../../store';


describe('Send Container', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><SendContainer /></Provider>);
  });

  it('should render Send', () => {
    expect(wrapper.find('Send')).to.have.lengthOf(1);
  });

  it('should bind successAlertDialogDisplayed action to Send props.showSuccessAlert', () => {
    const actionsSpy = sinon.spy(dialogActions, 'successAlertDialogDisplayed');
    wrapper.find('Send').props().showSuccessAlert({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind errorAlertDialogDisplayed action to Send props.showErrorAlert', () => {
    const actionsSpy = sinon.spy(dialogActions, 'errorAlertDialogDisplayed');
    wrapper.find('Send').props().showErrorAlert({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should bind transactionAdded action to Send props.addTransaction', () => {
    const actionsSpy = sinon.spy(transactionsActions, 'transactionAdded');
    wrapper.find('Send').props().addTransaction({});
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
