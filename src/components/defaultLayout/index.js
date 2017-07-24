import React from 'react';
import { Link } from 'react-router-dom';
import Account from '../account';
import PrivateRoute from '../privateRoute';

const DefaultLayout = ({ component: Component, ...rest }) => (
  <PrivateRoute {...rest} component={ matchProps => (
    <main>
      <Account />
      <Link to='/transactions'>Transactions</Link>
      <Link to='/voting'>Voting</Link>
      <Link to='/forging'>Forging</Link>
      <Component {...matchProps} />
    </main>
  )} />
);

export default DefaultLayout;
