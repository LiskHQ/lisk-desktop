import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { PrivateRouteRender } from './index';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

describe('PrivateRouteRender', () => {
  const isAuth = isAuthenticated => (
    mount(
      <MemoryRouter initialEntries={['/private/test']}>
        <div>
          <Route path='/' component={Public} />
          <PrivateRouteRender
            history={ { location: { pathname: '' } } }
            path='/private'
            render={({ match }) => <Route to={`${match.url}/test`} component={Private}/>}
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
