import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { spy } from 'sinon';
import ActionBar from '../actionBar';
import i18n from '../../i18n';
import Authenticate from './authenticate';


const fakeStore = configureStore();

describe('Authenticate', () => {
  let wrapper;
  let props;

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
    publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
    address: '16313739661670634666L',
  };

  const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';

  beforeEach(() => {
    props = {
      account,
      peers,
      t: (str, opts) => i18next.t(str, opts),
      nextAction: 'perform a sample action',
      closeDialog: spy(),
      accountUpdated: spy(),
    };

    const store = fakeStore({
      account: {
        balance: 100e8,
      },
    });
    wrapper = mount(<Authenticate {...props} />, {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    });
  });

  it('renders 3 compound React components', () => {
    expect(wrapper.find('InfoParagraph')).to.have.length(1);
    expect(wrapper.find(ActionBar)).to.have.length(1);
    expect(wrapper.find('AuthInputs')).to.have.length(1);
  });

  it('should render InfoParagraph with appropriate message', () => {
    expect(wrapper.find('InfoParagraph').text()).to.include(
      `You are looking into a saved account. In order to ${props.nextAction} you need to enter your passphrase`);
  });

  it('should activate primary button if correct passphrase entered', () => {
    expect(wrapper.find('button.authenticate-button').props().disabled).to.equal(true);
    wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
    expect(wrapper.find('button.authenticate-button').props().disabled).to.equal(false);
  });

  it('should call accountUpdated if entered passphrase and clicked submit', () => {
    wrapper.find('.passphrase input').simulate('change', { target: { value: passphrase } });
    wrapper.update();
    wrapper.find('Button.authenticate-button').simulate('click');
    wrapper.update();
    expect(props.accountUpdated).to.have.been.calledWith({
      activePeer: props.peers.data,
      passphrase,
    });
  });
});
