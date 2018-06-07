import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import history from '../../history';
import i18n from '../../i18n';
import MainMenuHOC from './index';

describe('MainMenuHOC', () => {
  // Mocking store
  const peers = {
    status: {
      online: false,
    },
    data: {
      currentPeer: 'localhost',
      port: 4000,
      options: {
        name: 'Custom Node',
      },
    },
  };
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-hub',
  };
  const store = configureMockStore([])({
    peers,
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
    wrapper = mount(<MemoryRouter><MainMenuHOC store={store}/></MemoryRouter>, options);
  });

  it('should mount MainMenu', () => {
    expect(wrapper.find('MainMenu')).to.have.lengthOf(1);
  });

  it('should mount 6 Tab inside MainMenu', () => {
    expect(wrapper.find('Tab')).to.have.lengthOf(6);
  });
});
