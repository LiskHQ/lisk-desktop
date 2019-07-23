import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import Piwik from '../../utils/piwik';
import routes from '../../constants/routes';

const CustomRoute = ({
  path, component, isPrivate, exact,
  settings,
  networkIsSet,
  accountLoading,
  forbiddenTokens,
  isAuthenticated, pathSuffix = '', pathPrefix = '', t, ...rest
}) => {
  if (!networkIsSet || accountLoading) {
    return null;
  }
  const { pathname, search } = rest.history.location;
  const fullPath = pathPrefix + path + pathSuffix;

  Piwik.tracking(rest.history, settings);

  if (forbiddenTokens.indexOf(settings.token.active) !== -1) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  return ((isPrivate && isAuthenticated) || !isPrivate
    ? (
      <main className={`${isPrivate ? offlineStyle.disableWhenOffline : ''} offlineWrapper`}>
        <ErrorBoundary errorMessage={t('An error occoured while rendering this page')}>
          <Route path={fullPath} component={component} exact={exact} />
        </ErrorBoundary>
      </main>
    )
    : <Redirect to={`${routes.login.path}?referrer=${pathname}${encodeURIComponent(search)}`} />
  );
};

CustomRoute.defaultProps = {
  forbiddenTokens: [],
};

export default CustomRoute;
