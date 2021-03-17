import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import { routes } from '@constants';
import i18n from '../i18n'; // initialized i18next instance
import App from '.';
import Login from '../components/screens/login/login';
import Wallet from '../components/screens/wallet';

const fakeStore = configureStore();

const addRouter = Component => (props, path) =>
  mount(<Provider {...props}>
    <MemoryRouter initialEntries={path}>
      <I18nextProvider i18n={i18n}>
        <Component />
      </I18nextProvider>
    </MemoryRouter>
  </Provider>);

const publicComponent = [
  { route: '/', component: Login },
];

const privateComponent = [
  { route: `${routes.wallet.path}`, component: Wallet },
];

describe.skip('App', () => {
  const navigateTo = addRouter(App);
  describe('renders correct routes', () => {
    const store = fakeStore({
      account: {},
      network: {
        name: 'Custom Node',
        networks: {
          LSK: {
            nodeUrl: 'http://localhost:4000',
            nethash: '23jh4g',
          },
        },
        status: { online: true },
      },
      settings: {
        autoLog: true,
        advancedMode: true,
        areTermsOfUseAccepted: true,
        token: {
          active: 'LSK',
          list: {
            BTC: true,
            LSK: true,
          },
        },
      },
      search: {
        suggestions: {
          delegates: [],
          addresses: [],
          transactions: [],
        },
      },
      transactions: {
        pending: [],
      },
    });
    publicComponent.forEach(({ route, component }) => {
      it(`should render ${component.name} component at "${route}" route`, () => {
        const wrapper = navigateTo({ store }, [route]);
        wrapper.find('LoadingBar').props().markAsLoaded();
        wrapper.update();
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });

    privateComponent.forEach(({ route, component }) => {
      it(`should redirect from ${component.name} component if user is not authenticated`, () => {
        const wrapper = navigateTo({ store }, [route]);
        wrapper.find('LoadingBar').props().markAsLoaded();
        wrapper.update();
        expect(wrapper.find(component).exists()).to.be.equal(false);
        expect(wrapper.find(Login).exists()).to.be.equal(true);
      });
    });
  });

  // These tests are skipped because App component use many components and all of them need
  // specific data to render. Each time you will add new components to App, this tests can be fall.
  // Need solution for these kinds of tests.
  describe.skip('allow to render private components after logged in', () => {
    const store = fakeStore({
      account: {
        publicKey: '000',
      },
      network: {
        name: 'Mainnet',
        neteworks: {
          LSK: {
            nodeUrl: 'http://localhost:4000',
            nethash: '23jh4g',
          },
        },
        status: { online: true },
      },
      settings: {
        token: {
          active: 'LSK',
        },
      },
    });
    privateComponent.forEach(({ route, component }) => {
      it(`should reder ${component.name} component at "${route}" route if user is authenticated`, () => {
        const wrapper = navigateTo({ store }, [route]);
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });
  });
});
