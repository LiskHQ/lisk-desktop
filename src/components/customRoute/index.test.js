import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router';
import { CustomRouteRender } from './index';
import i18n from '../../i18n';

const Public = () => <h1>Public</h1>;
const Private = () => <h1>Private</h1>;

describe('CustomRouteRender', () => {
  const store = configureMockStore([])({});
  const props = {
    t: key => key,
    history: { location: { pathname: '' } },
    path: '/private',
    component: Private,
  };
  const options = {
    context: { store, history, i18n },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

  const isAuth = ({ isAuthenticated, isPrivate }) => (
    mount(
      <MemoryRouter initialEntries={['/private/test']}>
        <div>
          <Route path='/' component={Public} />
          <CustomRouteRender
            { ...props }
            isAuthenticated={isAuthenticated}
            isPrivate={isPrivate} />
        </div>
      </MemoryRouter>,
      options,
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
