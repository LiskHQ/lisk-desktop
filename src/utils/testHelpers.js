/* eslint-disable no-console, max-lines, import/no-extraneous-dependencies */
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
 * Mounts components that are wrapped in WithRouter
 *
 * @returns {Object} Mounted component
 */
export const mountWithRouter = (Component, props, routeConfig = {}) =>
  mount(
    <MemoryRouter initialEntries={[props?.location ?? props?.history?.location ?? routeConfig]}>
      <Component {...props} />
    </MemoryRouter>
  );

/**
 * Mounts components that are wrapped in WithRouter with custom router
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
 * @returns {Object} Mounted component
 */
export const mountWithQueryClient = (Component, props = {}) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Rendered component
 */
export const mountWithRouterAndQueryClient = (Component, props) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Rendered component
 */
export const renderWithQueryClient = (Component, props) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Rendered component
 */
export const renderWithRouterAndQueryClient = (Component, props = {}) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Rerendered component
 */
export const rerenderWithRouterAndQueryClient = (Component, props = {}) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Mounted component
 */
export const mountWithQueryAndProps = (Component, props, store) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
 * @returns {Object} Rendered component
 */
export const renderWithQueryClientAndWC = (Component, props) => {
  console.log('## NOTE ##  This function is deprecated, please use smartRender instead.');
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
    [
      Router,
      {
        history: config.historyInfo
          ? {
              ...defaultRouterProps.history,
              ...config.historyInfo,
              location: { ...defaultRouterProps.history.location, ...config.historyInfo.location },
            }
          : defaultRouterProps.history,
      },
    ],
    config.queryClient
      ? [QueryClientProvider, { client: config.queryClientInfo ?? defaultQueryClient }]
      : null,
    config.store ? [Provider, { store: configureStore()(config.storeInfo ?? defaultStore) }] : null,
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

/**
 * Renders components that are wrapped in WithRouter
 *
 * @returns {Object} Rendered component
 * @returns {Object} Component wrapper
 */
export const smartRender = (Component, props, config = {}) => {
  const providers = analyzeConfig(config);
  const mergedProviderProps = providers.reduce(
    (acc, [, currentProps]) => ({ ...acc, ...currentProps }),
    {}
  );

  const wrapper =
    config.renderType === 'mount'
      ? mount(recursiveRender(Component, props, providers))
      : render(recursiveRender(Component, props, providers));

  return {
    wrapper,
    ...mergedProviderProps,
  };
};
