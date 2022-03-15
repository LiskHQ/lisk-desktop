import React from 'react';
import { useSelector } from 'react-redux';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { routes } from '@constants';
import accounts from '../../../../test/constants/accounts';
import ReclaimBalance from '../../screens/reclaimBalance';
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
        LSK: accounts.genesis,
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
          <Route path={routes.reclaim.path} component={ReclaimBalance} />
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

  it('should redirect to reclaim path if user is not migrated', () => {
    mockAppState.account.info.LSK = accounts.empty_account;
    const wrapper = isAuth({ isPrivate: true });
    expect(wrapper.find(ReclaimBalance).exists()).toBe(true);
  });
});
