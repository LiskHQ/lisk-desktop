import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import Login from './login';
import routes from '../../constants/routes';

describe('Login', () => {
  let wrapper;
  let account;
  let peers;
  let store;
  let history;
  let props;
  let options;
  const address = 'http:localhost:8080';
  const passphrase = 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin';
  let localStorageStub;

  // Mocking store
  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('showNetwork').returns(JSON.stringify(undefined));

    account = {
      isDelegate: false,
      address: '16313739661670634666L',
      username: 'lisk-hub',
    };
    peers = {
      data: {},
      options: {},
    };
    store = configureMockStore([])({
      peers,
      account,
      settings: {},
    });
    history = {
      location: {
        pathname: '',
        search: '',
      },
      push: spy(),
      replace: spy(),
    };
    props = {
      peers,
      account,
      history,
      accountsRetrieved: spy(),
      t: data => data,
      onAccountUpdated: () => {},
      setActiveDialog: spy(),
      liskAPIClientSet: spy(),
    };
    options = {
      context: {
        store, history, i18n, router: { route: history, history },
      },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
      },
      lifecycleExperimental: true,
    };
    wrapper = mount(<MemoryRouter><Login {...props}/></MemoryRouter>, options);
  });


  afterEach(() => {
    localStorageStub.restore();
  });

  describe('Generals', () => {
    it('should show error about passphrase length if passphrase is have wrong length', () => {
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      wrapper.find('.passphrase input').first().simulate('change', { target: { value: ' ' } });
      wrapper.find('.passphrase input').first().simulate('change', { target: { value: passphrase } });
      expect(wrapper.find('.passphrase')).to.contain(expectedError);
    });
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper = shallow(<Login {...props}/>, options);
      wrapper.setProps({ account: { address: 'dummy' } });
      expect(props.history.replace).to.have.been.calledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      wrapper = shallow(<Login {...props}/>, options);
      props.history.replace.reset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({ history, account: { address: 'dummy' } });
      expect(props.history.replace).to.have.been.calledWith(`${routes.delegates.path}`);
    });

    it('hides network options by default', () => {
      wrapper = shallow(<Login {...props}/>, options);
      props.history.replace.reset();
      wrapper.setProps({ history });
      expect(wrapper.find('.network')).to.have.length(0);
    });

    it('shows network options when url param showNetwork is true', () => {
      wrapper = shallow(<Login {...props}/>, options);
      props.history.replace.reset();
      history.location.search = '?showNetwork=true';
      wrapper.setProps({ history });
      expect(wrapper.find('.network')).to.have.length(1);
    });

    // @integration
    it.skip('calls localStorage.setItem(\'address\', address) if this.state.address', () => {
      const spyFn = spy(localStorage, 'setItem');
      // enable the network dropdown
      history.location.search = '?showNetwork=true';
      wrapper.setProps({ history });
      // set the network dropdown
      wrapper.find('div.network').simulate('click');
      // select custom node
      wrapper.find('div.network ul li').at(2).simulate('click');
      // fill the address
      wrapper.update();
      wrapper.find('Input.address input').simulate('change', { target: { value: address } });
      wrapper.setProps({ account: { address: 'dummy' } });
      expect(spyFn).to.have.been.calledWith('address', address);

      spyFn.restore();
      localStorage.removeItem('address');
    });

    it('calls this.props.history.push on signButton click', () => {
      wrapper.find('.new-account-button').simulate('click');
      expect(props.history.push).to.have.been.calledWith(`${routes.register.path}`);
    });
  });

  describe('After submission', () => {
    it('it should call liskAPIClientSet if not already logged with given passphrase', () => {
      wrapper.find('Input.passphrase input').simulate('change', { target: { value: passphrase } });
      wrapper.update();
      wrapper.find('form').simulate('submit');
      expect(props.liskAPIClientSet).to.have.been.calledWith();
    });

    // @integration
    it.skip('it should redirectToReferrer if already logged with given passphrase', () => {
      wrapper.setProps({ account: { address: 'dummy' } });
      wrapper.find('Input.passphrase input').simulate('change', { target: { value: passphrase } });
      wrapper.find('form').simulate('submit');
      expect(props.history.replace).to.have.been.calledWith();
    });
  });
});

