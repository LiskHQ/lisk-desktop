import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, useRouteMatch } from 'react-router-dom';
import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import Piwik from '../../../utils/piwik';
import routes from '../../../constants/routes';
import { isEmpty } from '../../../utils/helpers';

const getQueryString = (obj) => {
  if (!obj || isEmpty(obj)) return '';
  const keyValues = Object.keys(obj).map(key => `${key}=${obj[key]}`);
  return encodeURIComponent(keyValues);
};

// eslint-disable-next-line max-statements
const CustomRoute = ({
  path,
  exact,
  isPrivate,
  forbiddenTokens,
  pathSuffix,
  pathPrefix,
  component,
  t,
  history,
}) => {
  const settings = useSelector(state => state.settings);
  const isAuthenticated = useSelector(state =>
    (state.account.info && state.account.info[settings.token.active]));
  const networkIsSet = useSelector(state => !!state.network.name && !!state.network.serviceUrl);
  const { params } = useRouteMatch();

  if (!networkIsSet) return null;
  Piwik.tracking(history, settings);

  if (forbiddenTokens.indexOf(settings.token.active) !== -1) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  if (isPrivate && !isAuthenticated) {
    return <Redirect to={`${routes.login.path}?referrer=${path}&${getQueryString(params)}`} />;
  }

  return (
    <main className={`${isPrivate ? offlineStyle.disableWhenOffline : ''} offlineWrapper`}>
      <ErrorBoundary errorMessage={t('An error occoured while rendering this page')}>
        <Route
          path={`${pathPrefix}${path}${pathSuffix}`}
          exact={exact}
          key={path}
          component={component}
        />
      </ErrorBoundary>
    </main>
  );
};

CustomRoute.defaultProps = {
  t: str => str,
  pathSuffix: '',
  pathPrefix: '',
};

export default CustomRoute;
