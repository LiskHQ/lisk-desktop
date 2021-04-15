import React from 'react';
import { useSelector } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { routes } from '@constants';
import CustomRoute from './index';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('CustomRoute', () => {
  const mockAppState = {
    settings: {
      token: {
        active: 'LSK',
      },
    },
    account: {
      info: {
        LSK: 'some data',
      },
    },
    network: {
      name: 'testnet',
      networks: {
        LSK: {
          serviceUrl: 'someUrl',
        },
      },
    },
    transactions: { pending: [] },
  };

  beforeEach(() => {
    useSelector.mockImplementation(callback => callback(mockAppState));
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  const props = {
    t: key => key,
    history: { location: { pathname: '' } },
    path: '/private',
    component: Private,
    forbiddenTokens: [],
  };

  const isAuth = ({ isPrivate }) => (
    mount(
      <MemoryRouter initialEntries={['/private/test']}>
        <div>
          <Route path={routes.login.path} component={Public} />
          <CustomRoute
            {...props}
            isPrivate={isPrivate}
          />
        </div>
      </MemoryRouter>,
    )
  );
  it('should render Component if user is authenticated', () => {
    const wrapper = isAuth({ isPrivate: true });
    expect(wrapper.find(Private).exists()).toBe(true);
  });

  it('should redirect to root path if user is not authenticated', () => {
    mockAppState.account.info = {};
    const wrapper = isAuth({ isPrivate: true });
    expect(wrapper.find(Public).exists()).toBe(true);
  });
});
