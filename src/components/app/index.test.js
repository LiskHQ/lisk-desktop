import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import store from '../../store';
import App from './';
import Login from '../login';
import Transactions from '../transactions';
import Voting from '../voting';
import Forging from '../forging';

const addRouter = Component => (props, path) =>
    mount(
      <Provider {...props}>
        <MemoryRouter initialEntries={path}>
            <Component />
        </MemoryRouter>
      </Provider>,
    );

const routesComponent = [
  { route: '/', component: Login },
  { route: '/main/transactions', component: Transactions },
  { route: '/main/voting', component: Voting },
  { route: '/main/forging', component: Forging },
];

describe('App', () => {
  describe('renders correct routes', () => {
    const navigateTo = addRouter(App);
    routesComponent.forEach(({ route, component }) => {
      it.skip(`should render ${component.name} component at "${route}" route`, () => {
        const wrapper = navigateTo({ store }, [route]);
        expect(wrapper.find(component).exists()).to.be.equal(true);
      });
    });
  });
});
