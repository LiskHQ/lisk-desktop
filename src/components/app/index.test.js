import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';
import { expect } from 'chai';
import store from '../../store';
import App from './index';
import Login from '../login';

it('renders correct routes', () => {
  const wrapper = shallow(<App store={store} />);
  const pathMap = wrapper.find(Route).reduce((pathMapItem, route) => {
    const routeProps = route.props();
    pathMapItem[routeProps.path] = routeProps.component || routeProps.render;
    return pathMapItem;
  }, {});

  expect(pathMap['/']).to.be.equal(Login);
  expect(typeof pathMap['/main']).to.be.equal('function');
});
