import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export const PrivateRouteComponent = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={ matchProps => (
     isAuthenticated ? (
       <Component {...matchProps}/>
     ) :
      <Redirect to='/' />
    )}/>
  );

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default withRouter(connect(mapStateToProps)(PrivateRouteComponent));
