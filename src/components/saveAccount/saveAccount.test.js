import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { spy } from 'sinon';
import SaveAccount from './saveAccount';
import store from '../../store';


describe('SaveAccount', () => {
  let wrapper;
  let closeDialogSpy;
  let successToastSpy;
  let localStorageSpy;

  const props = {
    account: {
      publicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
    },
    closeDialog: () => {},
    successToast: () => {},
    done: () => {},
  };

  beforeEach(() => {
    closeDialogSpy = spy(props, 'closeDialog');
    successToastSpy = spy(props, 'successToast');
    localStorageSpy = spy(localStorage, 'setItem');
    wrapper = mount(<Provider store={store}><SaveAccount {...props} /></Provider>);
  });

  afterEach(() => {
    closeDialogSpy.restore();
    successToastSpy.restore();
    localStorageSpy.restore();
  });

  it('should render ActionBar', () => {
    expect(wrapper.find('ActionBar')).to.have.lengthOf(1);
  });

  it('should call props.closeDialog, props.successToast and localStorage.setItem on "save button" click', () => {
    wrapper.find('.save-account-button').simulate('click');
    const componentProps = wrapper.find(SaveAccount).props();
    expect(componentProps.closeDialog).to.have.been.calledWith();
    expect(componentProps.successToast).to.have.been.calledWith({ label: 'Account saved' });
    const expectedValue = '[{"publicKey":"fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88","network":"0","address":null}]';
    expect(localStorageSpy).to.have.been.calledWith('accounts', expectedValue);
  });
});

