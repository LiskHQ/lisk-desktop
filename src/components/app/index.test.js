import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import App from './';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';

const fakeStore = configureStore();

const addRouter = Component => (props, path) =>
    mount(
      <Provider {...props}>
        <MemoryRouter initialEntries={path}>
            <Component />
        </MemoryRouter>
      </Provider>,
    );

const publicComponent = [
  { route: '/', component: Login },
];

const privateComponent = [
  { route: '/main/transactions', component: Transactions },
  { route: '/main/voting', component: Voting },
  { route: '/main/forging', component: Forging },
];

describe('App', () => {
  const navigateTo = addRouter(App);
  describe('renders correct routes', () => {
    const store = fakeStore({
      account: {},
      dialog: {},
      peers: {},
    });
    publicComponent.forEach(({ route, component }) => {
      it(`should render ${component.name} component at "${route}" route`, () => {
        const wrapper = navigateTo({ store }, [route]);
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });

    privateComponent.forEach(({ route, component }) => {
      it(`should redirect from ${component.name} component if user is not authenticated`, () => {
        const wrapper = navigateTo({ store }, [route]);
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
      forging: {
        statics: {},
      },
      dialog: {},
      peers: {
        status: {
          online: true,
        },
        data: {
          options: {
            name: 'Test',
          },
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
