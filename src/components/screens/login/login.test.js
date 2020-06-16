import React from 'react';
import { expect } from 'chai';
import { spy, stub, useFakeTimers } from 'sinon';
import { mount } from 'enzyme';
import Login from './login';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('Login', () => {
  let wrapper;
  let clock;
  const account = {
    isDelegate: false,
    address: '16313739661670634666L',
    username: 'lisk-desktop',
  };
  const network = {
    status: { online: true },
    name: 'Custom Node',
    networks: {
      LSK: {
        nodeUrl: 'hhtp://localhost:4000',
        nethash: '2349jih34',
      },
    },
  };

  const settings = {
    areTermsOfUseAccepted: false,
    token: {
      active: 'LSK',
      list: {
        LSK: true,
        BTC: true,
      },
    },
  };

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: spy(),
    replace: spy(),
  };

  const match = {
    url: routes.login.path,
  };

  const props = {
    network,
    match,
    account,
    history,
    accountsRetrieved: spy(),
    t: data => data,
    onAccountUpdated: () => {},
    login: spy(),
    settingsUpdated: spy(),
    settings,
  };

  const { passphrase } = accounts.genesis;
  let localStorageStub;

  beforeEach(() => {
    localStorageStub = stub(localStorage, 'getItem');
    localStorageStub.withArgs('showNetwork').returns(JSON.stringify(undefined));
    clock = useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });

    wrapper = mount(<Login {...props} />);
  });

  afterEach(() => {
    history.location.search = '';
    localStorageStub.restore();
    clock.restore();
  });

  describe('Generals', () => {
    it('redirect to Terms of Use page', () => {
      expect(props.history.push).to.have.been.calledWith(`${routes.termsOfUse.path}`);
    });

    it('should show error about passphrase length if passphrase have wrong length', () => {
      const expectedError = 'Passphrase should have 12 words, entered passphrase has 11';
      const lastIndex = passphrase.lastIndexOf(' ');
      const clipboardData = {
        getData: () => passphrase.substring(0, lastIndex),
      };
      wrapper.find('passphraseInput input').first().simulate('paste', { clipboardData });
      expect(wrapper.find('passphraseInput Feedback')).to.contain(expectedError);
    });

    // it('Should show the address input when custom node is selected', () => {
    //   history.location.search = '?showNetwork=true';
    //   wrapper.setProps({ history });

    //   wrapper.find('Header .option').at(2).simulate('click');
    //   expect(wrapper.find('ThemedTBPrimaryButton').at(0)).to.have.className('connect-button');
    // });

    it('Should not render header if route is not /login', () => {
      wrapper.setProps({
        match: { url: routes.addAccount.path },
      });
      expect(wrapper).to.not.have.descendants('Header');
    });
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({
        history,
        account: { address: 'dummy' },
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.replace.resetHistory();
      history.location.search = `?referrer=${routes.voting.path}`;
      wrapper.setProps({
        history, account: { address: 'dummy' },
      });
      expect(props.history.replace).to.have.been.calledWith(`${routes.voting.path}`);
    });

    // it('shows network options when url param showNetwork is true', () => {
    //   props.history.replace.resetHistory();
    //   history.location.search = '?showNetwork=true';
    //   wrapper.setProps({ history });
    //   expect(wrapper.find('Header')).to.have.prop('showNetwork');
    // });
  });

  describe('After submission', () => {
    it('it should call props.login if not already logged with given passphrase', () => {
      wrapper.find('passphraseInput input').first().simulate('change', { target: { value: passphrase, dataset: { index: 0 } } });
      wrapper.update();
      wrapper.find('form').simulate('submit');
      expect(props.login).to.have.been.calledWith();
    });
  });
});
