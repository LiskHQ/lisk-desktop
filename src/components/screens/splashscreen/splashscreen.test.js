import React from 'react';
import { mount } from 'enzyme';
import SplashScreen from './splashscreen';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';

describe('SplashScreen', () => {
  let wrapper;
  let props;
  let history;

  beforeEach(() => {
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

    history = {
      location: {
        pathname: '',
        search: '',
      },
      push: jest.fn(),
      replace: jest.fn(),
    };

    const account = accounts.genesis;

    const settings = {
      areTermsOfUseAccepted: true,
      token: {
        active: 'LSK',
        list: {
          LSK: true,
          BTC: true,
        },
      },
    };

    props = {
      network,
      account,
      history,
      settings,
      liskAPIClient: {
        node: {
          getConstants: jest.fn(),
        },
      },
      errorToastDisplayed: jest.fn(),
    };

    wrapper = mount(<SplashScreen {...props} />);
  });

  it('Should render all links, Sign in, Create an Account and Explre as Guest', () => {
    expect(wrapper.find('.login-button button').text()).toEqual('Sign in');
    expect(wrapper.find('.new-account-button button').text()).toEqual('Create an account');
    expect(wrapper.find('.link').at(0).text()).toEqual('Explore as a guest');
  });

  describe('History management', () => {
    it('calls this.props.history.replace(\'/dashboard\')', () => {
      wrapper.setProps({ account: { address: 'dummy' } });
      expect(props.history.replace).toBeCalledWith(`${routes.dashboard.path}`);
    });

    it('calls this.props.history.replace with referrer address', () => {
      props.history.replace.mockReset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({ account: { address: 'dummy' } });
      expect(props.history.replace).toBeCalledWith(`${routes.delegates.path}`);
    });

    it('calls this.props.history.replace with referrer address on network change', () => {
      props.history.replace.mockReset();
      history.location.search = `?referrer=${routes.delegates.path}`;
      wrapper.setProps({ network: { name: 'Testnet' } });
      expect(props.history.replace).toBeCalledWith(`${routes.delegates.path}`);
    });
  });

  describe('Terms of Use', () => {
    it('redirect to terms of use page', () => {
      wrapper = mount(
        <SplashScreen
          {...props}
          settings={{ ...props.settings, areTermsOfUseAccepted: false }}
        />,
      );
      expect(props.history.push).toBeCalledWith(`${routes.termsOfUse.path}`);
    });
  });

  describe('Explore as a Guest', () => {
    it('procced to Dashboard when network Node is UP', async (done) => {
      props.liskAPIClient.node.getConstants.mockResolvedValueOnce({});
      expect(wrapper.find('.link').at(0).text()).toEqual('Explore as a guest');
      wrapper.find('.link').at(0).simulate('click');
      // TODO refactor this as should be a better way to test it https://stackoverflow.com/a/43855794
      setImmediate(() => {
        expect(props.history.push).toHaveBeenCalled();
        expect(props.errorToastDisplayed).not.toHaveBeenCalled();
        done();
      });
    });

    it('trigger toaster message when network Node is DOWN', async (done) => {
      props.liskAPIClient.node.getConstants.mockRejectedValue(new Error('Network Error'));
      expect(wrapper.find('.link').at(0).text()).toEqual('Explore as a guest');
      wrapper.find('.link').at(0).simulate('click');
      // TODO refactor this as should be a better way to test it https://stackoverflow.com/a/43855794
      setImmediate(() => {
        expect(props.history.push).not.toHaveBeenCalled();
        expect(props.errorToastDisplayed).toBeCalled();
        done();
      });
    });
  });
});
