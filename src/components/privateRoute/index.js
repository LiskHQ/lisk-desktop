import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export const PrivateRouteRender = ({ render, isAuthenticated, ...rest }) => (
  <Route {...rest} render={ matchProps => (
    isAuthenticated ? render(matchProps) : <Redirect to={`/?referrer=${rest.history.location.pathname}${rest.history.location.search}`} />
  )}/>
);

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default withRouter(connect(mapStateToProps)(PrivateRouteRender));
