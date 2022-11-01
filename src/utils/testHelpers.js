/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

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
    </Provider>
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
export const mountWithRouter = (Component, props, routeConfig = {}) =>
  mount(
    <MemoryRouter initialEntries={[routeConfig]}>
      <Component {...props} />
    </MemoryRouter>
  );

/**
 * Mounts components that are wrapped in WithRouter with custom router
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Mounted component
 */
const defaultHistoryProps = {
  listen: () => {},
  location: {
    pathname: '',
  },
};

export const mountWithCustomRouter = (Component, props) =>
  mount(
    <Router
      history={props.history ? { ...defaultHistoryProps, ...props.history } : defaultHistoryProps}
    >
      <Component {...props} />
    </Router>
  );

/**
 * Mounts components that are wrapped in WithRouter and store with custom router
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {?Object} store - A fake redux store object
 *
 * @returns {Object} Mounted component
 */
export const mountWithCustomRouterAndStore = (Component, props, store) =>
  mount(
    <Provider store={configureStore()(store)}>
      <Router
        history={props.history ? { ...defaultHistoryProps, ...props.history } : defaultHistoryProps}
      >
        <Component {...props} />
      </Router>
    </Provider>
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
export const mountWithRouterAndStore = (Component, props, routeConfig = {}, store) =>
  mount(
    <Provider store={configureStore()(store)}>
      <MemoryRouter initialEntries={[routeConfig]}>
        <Component {...props} />
      </MemoryRouter>
    </Provider>
  );

/**
 * Mounts components that are wrapped in Query Client
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Mounted component
 */
export const mountWithQueryClient = (Component, props = {}) => {
  const queryClient = new QueryClient();
  return mount(
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
    </QueryClientProvider>
  );
};

/**
 * Mounts components that are wrapped in QueryClientProvider and Router
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rendered component
 */
export const mountWithRouterAndQueryClient = (Component, props) => {
  const queryClient = new QueryClient();

  return mount(
    <Router
      history={props.history ? { ...defaultHistoryProps, ...props.history } : defaultHistoryProps}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    </Router>
  );
};

/**
 * Renders components that are wrapped in WithRouter
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {?Object} routeConfig - A fake history.location object
 *
 * @returns {Object} Mounted component
 */
export const renderWithRouter = (Component, props, routeConfig = {}) =>
  render(
    <MemoryRouter initialEntries={[routeConfig]}>
      <Component {...props} />
    </MemoryRouter>
  );

/**
 * Renders components that are wrapped in WithRouter
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rendered component
 */
export const renderWithCustomRouter = (Component, props) =>
  render(
    <Router
      history={props.history ? { ...defaultHistoryProps, ...props.history } : defaultHistoryProps}
    >
      <Component {...props} />
    </Router>
  );

/**
 * Renders components that are wrapped in QueryClientProvider
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rendered component
 */
export const renderWithQueryClient = (Component, props) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Component {...props} />
    </QueryClientProvider>
  );
};

/**
 * Renders components that are wrapped in QueryClientProvider and Router
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rendered component
 */
export const renderWithRouterAndQueryClient = (Component, props = {}) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <Router
        history={props.history ? { ...defaultHistoryProps, ...props.history } : defaultHistoryProps}
      >
        <Component {...props} />
      </Router>
    </QueryClientProvider>
  );
};

/**
 * Rerenders components that are wrapped in QueryClientProvider and Router
 *
 * @param {Class|Function} Component - A React component to be rerendered
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rerendered component
 */
export const rerenderWithRouterAndQueryClient = (Component, props = {}) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[props?.history ?? defaultHistoryProps]}>
        <Component {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

/**
 * Mounts components that require to access Redux store and QueryClient
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {Object} store - A fake Redux store object
 *
 * @returns {Object} Mounted component
 */
export const mountWithQueryAndProps = (Component, props, store) => {
  const queryClient = new QueryClient();

  return mount(
    <Provider store={configureStore()(store)}>
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

/**
 * render's components that requires access Redux store
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {Object} store - A fake Redux store object
 *
 * @returns {Object} Mounted component
 */
export const renderWithStore = (Component, props, store) =>
  render(
    <Provider store={configureStore()(store)}>
      <Component {...props} />
    </Provider>
  );
