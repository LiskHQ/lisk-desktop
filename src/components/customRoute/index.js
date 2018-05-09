import React from 'react';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

export const CustomRouteRender = ({ path, component, isPrivate, exact,
  isAuthenticated, pathSuffix = '', pathPrefix = '', t, ...rest }) => {
  const { pathname, search } = rest.history.location;
  const fullPath = pathPrefix + path + pathSuffix;
  return ((isPrivate && isAuthenticated) || !isPrivate ?
    <main className={isPrivate ? offlineStyle.disableWhenOffline : null}>
      <ErrorBoundary errorMessage={t('An error occoured while rendering this page')}>
        <Route path={fullPath} component={component} exact={exact} />
      </ErrorBoundary>
    </main>
    : <Redirect to={`/?referrer=${pathname}${encodeURIComponent(search)}`} />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: !!state.account.publicKey,
});

export default withRouter(connect(mapStateToProps)(translate()(CustomRouteRender)));
