/* eslint-disable  max-lines, import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { context as wsContext } from '@blockchainApplication/connection/__fixtures__/requestSummary';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const history = createMemoryHistory();

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
    <MemoryRouter initialEntries={[history, routeConfig]}>
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
  const queryClient = new QueryClient();
  return mount(
    <MemoryRouter initialEntries={[history]}>
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    </MemoryRouter>
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[props?.location ?? {}]}>
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
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
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

/**
 * render's components that requires access Redux store with react router
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 * @param {Object} store - A fake Redux store object
 *
 * @returns {Object} Mounted component
 */
export const renderWithRouterAndStore = (Component, props, store) =>
  render(
    <Provider store={configureStore()(store)}>
      <MemoryRouter initialEntries={[props?.location ?? {}]}>
        <Component {...props} />
      </MemoryRouter>
    </Provider>
  );

export const renderWithRouterAndStoreAndQueryClient = (Component, props = {}, store) => {
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
  const queryClient = new QueryClient();

  return render(
    <Provider store={configureStore()(store)}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[props?.location ?? {}]}>
          <Component {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
};

/**
 * Renders components that are wrapped in QueryClientProvider
 *
 * @param {Class|Function} Component - A React component to be tested
 * @param {Object} props - Set of props to be passed to the component
 *
 * @returns {Object} Rendered component
 */
export const renderWithQueryClientAndWC = (Component, props) => {
  console.log(' ## NOTE ##  This function is deprecated, please use smartRender instead.');
  const queryClient = new QueryClient();
  return render(
    <ConnectionContext.Provider value={wsContext}>
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    </ConnectionContext.Provider>
  );
};

const analyzeConfig = (config = { queryClient: false, store: false, wc: false }) => {
  const defaultLocation = {
    pathname: '',
    search: '',
    hash: '',
  };
  const defaultRouterProps = {
    history: {
      listen: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      location: defaultLocation,
    },
  };

  const defaultStore = {};
  const defaultQueryClient = new QueryClient();

  return [
    [Router, { ...defaultRouterProps, ...config?.historyInfo }],
    config.queryClient
      ? [QueryClientProvider, { client: config?.queryClientInfo ?? defaultQueryClient }]
      : null,
    config.store ? [Provider, { store: config?.storeInfo ?? defaultStore }] : null,
    config.wc ? [ConnectionContext.Provider, { value: wsContext }] : null,
  ].filter(Boolean);
};

const recursiveRender = (Component, props, providers) =>
  providers.reduce(
    (wrapperComponent, [CurrentProvider, currentProps], index) => (
      <CurrentProvider {...currentProps} key={index}>
        {wrapperComponent}
      </CurrentProvider>
    ),
    <Component {...props} />
  );

export const smartRender = (Component, props, config) => {
  const providers = analyzeConfig(config);
  const mergedProviderProps = providers.reduce(
    (acc, [, currentProps]) => ({ ...acc, ...currentProps }),
    {}
  );

  const wrapper = render(recursiveRender(Component, props, providers));

  return {
    wrapper,
    ...mergedProviderProps,
  };
};
