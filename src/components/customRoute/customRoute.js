import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';

const CustomRoute = ({
  path, component, isPrivate, exact,
  isAuthenticated, pathSuffix = '', pathPrefix = '', t, ...rest
}) => {
  const { pathname, search } = rest.history.location;
  const fullPath = pathPrefix + path + pathSuffix;
  return ((isPrivate && isAuthenticated) || !isPrivate
    ? <main className={isPrivate ? offlineStyle.disableWhenOffline : null}>
      <ErrorBoundary errorMessage={t('An error occoured while rendering this page')}>
        <Route path={fullPath} component={component} exact={exact} />
      </ErrorBoundary>
    </main>
    : <Redirect to={`/?referrer=${pathname}${encodeURIComponent(search)}`} />
  );
};

export default CustomRoute;
