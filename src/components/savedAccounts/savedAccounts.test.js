import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SavedAccounts from './savedAccounts';

const fakeStore = configureStore();

describe('SavedAccounts', () => {
  let wrapper;
  let closeDialogSpy;
  let accountSavedSpy;
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const savedAccounts = [
    {
      publicKey: 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
      network: 0,
    },
    {
      network: 2,
      publicKey,
      address: 'http://localhost:4000',
    },
    {
      network: 0,
      publicKey,
    },
  ];

  const props = {
    closeDialog: () => {},
    accountSaved: () => {},
    accountRemoved: () => {},
    accountSwitched: () => {},
    networkOptions: {
      code: 0,
    },
    publicKey,
    savedAccounts: [],
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
    wrapper = mount(<SavedAccounts {...props} />, {
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

  it('should call props.accountSaved on "save button" click', () => {
    wrapper.find('button.add-active-account-button').simulate('click');
    const componentProps = wrapper.find(SavedAccounts).props();
    expect(componentProps.accountSaved).to.have.been.calledWith();
  });

  it('should render InfoParagraph', () => {
    wrapper.find('button.add-active-account-button').simulate('click');
    expect(wrapper.find('InfoParagraph')).to.have.lengthOf(1);
  });

  it('should render savedAccounts.length table rows', () => {
    wrapper.find('button.add-active-account-button').simulate('click');
    wrapper.setProps({
      ...props,
      savedAccounts,
    });
    expect(wrapper.find('TableRow')).to.have.lengthOf(savedAccounts.length);
  });
});

