import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import history from '../../history';
import SettingHOC from './index';
import * as accountsActions from '../../actions/account';
import * as settingActions from '../../actions/settings';

describe('SettingHOC', () => {
  // Mocking store
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-hub',
    secondSignature: 1,
  };
  const store = configureMockStore([])({
    account,
    activePeerSet: () => {},
    settings: {
      autoLog: true,
      advancedMode: true,
    },
  });
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><SettingHOC store={store}/></MemoryRouter>, options);
  });

  it('should mount Setting', () => {
    expect(wrapper.find('Setting')).to.have.lengthOf(1);
  });

  it('should connect accountUpdated action using dispatch function', () => {
    const actionsSpy = spy(accountsActions, 'accountUpdated');
    wrapper.find('Setting').props().accountUpdated();
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });

  it('should connect settingsUpdated action using dispatch function', () => {
    const actionsSpy = spy(settingActions, 'settingsUpdated');
    wrapper.find('Setting').props().settingsUpdated();
    expect(actionsSpy).to.be.calledWith();
    actionsSpy.restore();
  });
});
