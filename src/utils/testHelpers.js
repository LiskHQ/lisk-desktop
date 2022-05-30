/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

/**
 * Mounts components that require to access Redux store
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {Object} store - A fake Redux store object
 *
 * @returns {Object} Mounted component
 */
export const mountWithProps = (Component, props, store) =>
  mount(
    <Provider store={configureStore()(store)}>
      <Component {...props} />
    </Provider>,
  );

/**
 * Mounts components that are wrapped in WithRouter
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {?Object} routeConfig - A fake history.location object
 *
 * @returns {Object} Mounted component
 */
export const mountWithRouter = (Component, props, routeConfig = {}) => mount(
  <MemoryRouter
    initialEntries={[routeConfig]}
  >
    <Component {...props} />
  </MemoryRouter>,
);

/**
 * Mounts components that are wrapped in WithRouter
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {?Object} routeConfig - A fake history.location object
 * @param {?Object} store - A fake redux store object
 *
 * @returns {Object} Mounted component
 */
export const mountWithRouterAndStore = (Component, props, routeConfig = {}, store) => mount(
  <Provider store={configureStore()(store)}>
    <MemoryRouter
      initialEntries={[routeConfig]}
    >
      <Component {...props} />
    </MemoryRouter>
  </Provider>,
);

/**
 * Mounts components that are wrapped in WithRouter
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {?Object} routeConfig - A fake history.location object
 * @param {?Object} store - A fake redux store object
 *
 * @returns {Object} Mounted component
 */
export const renderWithRouter = (Component, props, routeConfig = {}) => render(
  <MemoryRouter
    initialEntries={[routeConfig]}
  >
    <Component {...props} />
  </MemoryRouter>,
);
