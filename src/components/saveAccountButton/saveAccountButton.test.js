import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as saveAccountUtils from '../../utils/saveAccount';
import store from '../../store';
import SaveAccountButton from './saveAccountButton';

describe('SaveAccountButton', () => {
  const props = {
    successToast: () => {},
    setActiveDialog: () => {},
  };

  it('Allows to remove saved account from localStorage if accoutn saved already', () => {
    const removeSavedAccountSpy = sinon.spy(saveAccountUtils, 'removeSavedAccount');
    const successToastSpy = sinon.spy(props, 'successToast');

    const wrapper = mount(<Provider store={store}><SaveAccountButton {...props} /></Provider>);
    wrapper.find('MenuItem').simulate('click');
    expect(removeSavedAccountSpy).to.have.been.calledWith();
    expect(successToastSpy).to.have.been.calledWith({ label: 'Account forgotten locally.' });

    removeSavedAccountSpy.restore();
    successToastSpy.restore();
  });

  it('Allows to open SaveAccount modal if account not yet saved', () => {
    const getSavedAccountMock = sinon.mock(saveAccountUtils);
    getSavedAccountMock.expects('getSavedAccount').returns();
    const setActiveDialogSpy = sinon.spy(props, 'setActiveDialog');

    const wrapper = mount(<Provider store={store}><SaveAccountButton {...props} /></Provider>);
    wrapper.find('MenuItem').simulate('click');
    expect(setActiveDialogSpy).to.have.been.calledWith();

    setActiveDialogSpy.restore();
    getSavedAccountMock.restore();
  });
});
