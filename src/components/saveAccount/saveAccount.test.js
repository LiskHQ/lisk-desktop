import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SaveAccount from './saveAccount';

const fakeStore = configureStore();

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
    t: key => key,
  };

  beforeEach(() => {
    closeDialogSpy = spy(props, 'closeDialog');
    accountSavedSpy = spy(props, 'accountSaved');
    const store = fakeStore({
      account: {
        balance: 100e8,
      },
    });
    wrapper = mount(<SaveAccount {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  afterEach(() => {
    closeDialogSpy.restore();
    accountSavedSpy.restore();
  });

  it.skip('should render ActionBar', () => {
    expect(wrapper.find('ActionBar')).to.have.lengthOf(1);
  });

  it('should call props.closeDialog and props.accountSaved on "save button" click', () => {
    wrapper.find('.save-account-button').simulate('click');
    const componentProps = wrapper.find(SaveAccount).props();
    expect(componentProps.closeDialog).to.have.been.calledWith();
    expect(componentProps.accountSaved).to.have.been.calledWith();
  });
});

