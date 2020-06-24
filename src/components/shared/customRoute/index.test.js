import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import CustomRoute from './index';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

describe('CustomRoute', () => {
  const props = {
    t: key => key,
    history: { location: { pathname: '' } },
    path: '/private',
    component: Private,
    settings: {
      statistics: false,
      token: {
        active: 'LSK',
      },
    },
    networkIsSet: true,
    accountLoading: false,
  };

  const isAuth = ({ isAuthenticated, isPrivate }) => (
    mount(
      <MemoryRouter initialEntries={['/private/test']}>
        <div>
          <Route path="/" component={Public} />
          <CustomRoute
            {...props}
            isAuthenticated={isAuthenticated}
            isPrivate={isPrivate}
          />
        </div>
      </MemoryRouter>,
    )
  );
  it('should render Component if user is authenticated', () => {
    const wrapper = isAuth({ isAuthenticated: true, isPrivate: true });
    expect(wrapper.find(Private)).to.have.length(1);
  });

  it('should redirect to root path if user is not authenticated', () => {
    const wrapper = isAuth({ isAuthenticated: false, isPrivate: true });
    expect(wrapper.find(Public)).to.have.length(1);
  });
});
