import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export const PrivateRouteRender = ({ render, isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
    console.log('Authenticated');
    return (
      <Route {...rest} render={ matchProps => render(matchProps)} />
    );
  }
  console.log('REDIRECTING', `/?referrer=${rest.history.location.pathname}${encodeURIComponent(rest.history.location.search)}`);
  return (
    <Redirect to={`/?referrer=${rest.history.location.pathname}${encodeURIComponent(rest.history.location.search)}`} />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default withRouter(connect(mapStateToProps)(PrivateRouteRender));
