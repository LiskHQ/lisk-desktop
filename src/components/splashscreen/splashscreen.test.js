import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import i18n from '../../i18n';
import SplashScreen from './splashscreen';
import accounts from '../../../test/constants/accounts';
import routes from '../../constants/routes';

describe('V2 SplashScreen', () => {
  let wrapper;

  const peers = {
    data: {},
    options: {},
  };

  const history = {
    location: {
      pathname: '',
      search: '',
    },
    push: jest.fn(),
    replace: jest.fn(),
  };

  const account = accounts.genesis;

  const settings = {
    areTermsOfUseAccepted: false,
  };

  const store = configureMockStore([])({
    peers,
    account,
    settings,
  });

  const options = {
    context: { store, i18n, history },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    },
  };

  const props = {
    peers,
    account,
    history,
    settings,
  };

  beforeEach(() => {
    wrapper = mount(<MemoryRouter><SplashScreen {...props} /></MemoryRouter>, options);
  });

  it('Should render all links, Sign in, Create an Account and Explre as Guest', () => {
    expect(wrapper.find('.login-button button').text()).toEqual('Sign In');
    expect(wrapper.find('.new-account-button button').text()).toEqual('Create an Account');
    expect(wrapper.find('.link').at(0).text()).toEqual('Explore as a Guest');
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({
        history,
        children: React.cloneElement(wrapper.props().children, {
          account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).toBeCalledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.replace.mockReset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({
        children: React.cloneElement(wrapper.props().children, {
          history, account: { address: 'dummy' },
        }),
      });
      expect(props.history.replace).toBeCalledWith(`${routes.delegates.path}`);
    });
  });

  describe('Terms of Use', () => {
    beforeEach(() => {
      wrapper = mount(<MemoryRouter><SplashScreen {...props} /></MemoryRouter>, options);
    });

    it('redirect to terms of use page', () => {
      wrapper.setProps({
        settings: { areTermsOfUseAccepted: false },
      });
      wrapper.update();
      expect(props.history.push).toBeCalledWith(`${routes.termsOfUse.path}`);
    });
  });
});
