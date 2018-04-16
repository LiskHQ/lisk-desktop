import React from 'react';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

export const CustomRouteRender = ({ path, component, isPrivate, exact,
  isAuthenticated, pathSuffix = '', pathPrefix = '', ...rest }) => {
  const { pathname, search } = rest.history.location;
  const fullPath = pathPrefix + path + pathSuffix;
  return ((isPrivate && isAuthenticated) || !isPrivate ?
    <main className={isPrivate ? offlineStyle.disableWhenOffline : null}>
      <Route path={fullPath} component={component} exact={exact} />
    </main>
    : <Redirect to={`/?referrer=${pathname}${encodeURIComponent(search)}`} />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default withRouter(connect(mapStateToProps)(CustomRouteRender));
