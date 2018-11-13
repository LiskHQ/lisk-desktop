import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import { spy, match } from 'sinon';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';

import networks from '../../constants/networks';
import accounts from '../../../test/constants/accounts';
import i18n from '../../i18n';
import Register from './register';


describe('Register', () => {
  let wrapper;
  const peers = { data: {} };
  const account = {};
  const { passphrase } = accounts.delegate;
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
    network: networks.mainnet,
    activePeerSet: spy(),
    t: key => key,
  };

  beforeEach(() => {
    wrapper = mount(<Provider store={store}>
      <Router>
        <Register {...prop} />
      </Router>
    </Provider>, options);
  });

  it('renders MultiStep component', () => {
    expect(wrapper.find('MultiStep')).to.have.length(1);
  });

  it('initially renders Create component', () => {
    expect(wrapper.find('Create')).to.have.length(1);
  });

  it('should return to Login page if Back clicked in first step', () => {
    wrapper.find('.multistep-back').simulate('click');
    wrapper.update();
    expect(wrapper.find('Register').props().history.location.pathname).to.be.equal('/');
  });

  it('should call activePeerSet with network and passphrase', () => {
    wrapper.find('MultiStep').props().finalCallback(passphrase);
    expect(prop.activePeerSet).to.have.been.calledWith(match({
      passphrase,
      network: networks.mainnet,
    }));
  });

  it('should return to Login page when prevPage in MultiStep is executed', () => {
    wrapper.find('MultiStep').props().prevPage();
    wrapper.update();
    expect(wrapper.find('Register').props().history.location.pathname).to.be.equal('/');
  });

  it('should remove "contentFocused" class in unMount', () => {
    expect(document.getElementsByClassName('contentFocused')).to.have.length(1);
    wrapper.unmount();
    expect(document.getElementsByClassName('contentFocused')).to.have.length(0);
  });
});
