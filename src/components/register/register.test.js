import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import Register from './register';

describe('Register', () => {
  let wrapper;
  const peers = { data: {} };
  const account = {};
  const store = configureMockStore([])({
    peers,
    account,
    activePeerSet: () => {},
  });
  const options = {
    context: { store },
    childContextTypes: {
      store: PropTypes.object.isRequired,
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
    props.onPassGenerated('sample passphrase');
    expect(prop.activePeerSet).to.have.been.calledWith({
      network: { name: 'Mainnet', port: 443, ssl: true },
      passphrase: 'sample passphrase',
    });
  });
});
