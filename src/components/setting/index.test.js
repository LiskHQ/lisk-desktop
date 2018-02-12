import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import SettingHOC from './index';

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
});
