import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy, stub } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import i18n from '../../i18n';
import networks from '../../constants/networks';
import Register from './register';
import * as Utils from '../../utils/login';


describe('Register', () => {
  let wrapper;
  let loginData;
  const peers = { data: {} };
  const account = {};
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };
  const prop = {
    account,
    peers,
    activePeerSet: spy(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Register {...prop} />, options);
    loginData = stub(Utils, 'getLoginData');
  });

  afterEach(() => {
    loginData.restore();
  });

  it('renders Passphrase component', () => {
    expect(wrapper.find('Passphrase')).to.have.length(1);
  });

  it('should mount Register with appropriate properties', () => {
    const props = wrapper.find('Passphrase').props();
    expect(props.useCaseNote).to.be.equal('your passphrase will be required for logging in to your account.');
    expect(props.securityNote).to.be.equal('This passphrase is not recoverable and if you lose it, you will lose access to your account forever.');
    expect(props.confirmButton).to.be.equal('Login');
    expect(props.keepModal).to.be.equal(false);
    expect(typeof props.onPassGenerated).to.be.equal('function');
  });

  it('should call activePeerSet if props.onPassGenerated is called', () => {
    const props = wrapper.find('Passphrase').props();

    loginData.returns({ address: 'some address', networkIndex: networks.mainnet.code });
    props.onPassGenerated('sample passphrase');

    expect(prop.activePeerSet).to.have.been.calledWith({
      network: networks.mainnet,
      passphrase: 'sample passphrase',
    });
  });

  it('should call activePeerSet with testnet if network index is testnet', () => {
    const props = wrapper.find('Passphrase').props();

    loginData.returns({ address: 'invalid address', networkIndex: networks.testnet.code });

    props.onPassGenerated('sample passphrase');
    expect(loginData).to.have.been.calledWith();

    expect(prop.activePeerSet).to.have.been.calledWith({
      network: networks.testnet,
      passphrase: 'sample passphrase',
    });
  });

  it('should call activePeerSet with mainnet if network index is custom node and address is invalid', () => {
    const props = wrapper.find('Passphrase').props();

    loginData.returns({ address: 'invalid address', networkIndex: networks.customNode.code });

    props.onPassGenerated('sample passphrase');
    expect(loginData).to.have.been.calledWith();

    expect(prop.activePeerSet).to.have.been.calledWith({
      network: networks.mainnet,
      passphrase: 'sample passphrase',
    });
  });

  it('should call activePeerSet with custom node if network index is custom node and address is valid', () => {
    const props = wrapper.find('Passphrase').props();

    loginData.returns({ address: '127.0.0.1:8080', networkIndex: networks.customNode.code });

    props.onPassGenerated('sample passphrase');
    expect(loginData).to.have.been.calledWith();

    const network = networks.customNode;
    network.address = '127.0.0.1:8080';
    expect(prop.activePeerSet).to.have.been.calledWith({
      network,
      passphrase: 'sample passphrase',
    });
  });
});
