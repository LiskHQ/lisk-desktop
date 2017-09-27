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
  let accountSavedSpy;

  const props = {
    account: {
      publicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
    },
    closeDialog: () => {},
    accountSaved: () => {},
  };

  beforeEach(() => {
    closeDialogSpy = spy(props, 'closeDialog');
    accountSavedSpy = spy(props, 'accountSaved');
    wrapper = mount(<Provider store={store}><SaveAccount {...props} /></Provider>);
  });

  afterEach(() => {
    closeDialogSpy.restore();
    accountSavedSpy.restore();
  });

  it('should render ActionBar', () => {
    expect(wrapper.find('ActionBar')).to.have.lengthOf(1);
  });

  it('should call props.closeDialog and props.accountSaved on "save button" click', () => {
    wrapper.find('.save-account-button').simulate('click');
    const componentProps = wrapper.find(SaveAccount).props();
    expect(componentProps.closeDialog).to.have.been.calledWith();
    expect(componentProps.accountSaved).to.have.been.calledWith();
  });
});

