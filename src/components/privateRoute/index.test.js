import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { PrivateRouteComponent } from './index';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

describe('<PrivateRoute />', () => {
  const isAuth = isAuthenticated => (
    mount(
      <MemoryRouter initialEntries={['/private']}>
        <div>
          <Route path='/' component={Public} />
          <PrivateRouteComponent
            path='/private'
            component={Private}
            isAuthenticated={isAuthenticated} />
        </div>
      </MemoryRouter>,
    )
  );
  it('should render Component if user is authenticated', () => {
    const wrapper = isAuth(true);
    expect(wrapper.find(Private)).to.have.length(1);
  });

  it('should redirect to root path if user is not authenticated', () => {
    const wrapper = isAuth(false);
    expect(wrapper.find(Public)).to.have.length(1);
  });
});
