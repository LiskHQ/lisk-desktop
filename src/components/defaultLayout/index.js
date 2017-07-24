import React from 'react';
import Account from '../account';
import PrivateRoute from '../privateRoute';

const DefaultLayout = ({ component: Component, ...rest }) => (
  <PrivateRoute {...rest} component={ matchProps => (
    <main>
      <Account />
      <Component {...matchProps} />
    </main>
  )} />
);

export default DefaultLayout;
