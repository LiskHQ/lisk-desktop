/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { selectActiveTokenAccount } from '@common/store';
import { useAccounts } from '@account/hooks';
import Piwik from 'src/utils/piwik';
import routes from '@screens/router/routes';
import ManageAccounts from '@account/components/ManageAccounts';
import offlineStyle from 'src/modules/common/components/offlineWrapper/offlineWrapper.css';
import ErrorBoundary from './errorBoundary';

const checkNetwork = (state) =>
  !!state.network.name
  && !!(
    state.network.networks
    && state.network.networks.LSK
    && state.network.networks.LSK.serviceUrl
  );

// eslint-disable-next-line max-statements
const CustomRoute = ({
  path,
  exact,
  isPrivate,
  forbiddenTokens,
  component,
  t,
  history,
}) => {
  const wallet = useSelector(state => selectActiveTokenAccount(state));
  const token = useSelector(state => state.token);
  const isNetworkSet = useSelector(checkNetwork);
  const isAuthenticated = !!wallet.summary;
  const { search = '' } = history.location;
  const { accounts } = useAccounts();

  Piwik.tracking(history, token);

  if (forbiddenTokens.indexOf(token.active) !== -1) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  if (!isAuthenticated && path === routes.dashboard.path) {
    const route = accounts.length > 0 ? routes.manageAccounts.path : routes.addAccountOptions.path;

    history.replace(route);
  }

  if (isPrivate && !isAuthenticated) {
    return (
      <Redirect
        to={`${routes.manageAccounts.path}?referrer=${path.replace(
          /\/(send|vote)/,
          '',
        )}&${search.replace(/^\?/, '')}`}
      />
    );
  }

  if (
    wallet.summary?.isMigrated === false
    && history.location.pathname !== routes.reclaim.path
    && history.location.pathname !== routes.login.path
    && isAuthenticated
  ) {
    return <Redirect to={`${routes.reclaim.path}`} />;
  }

  return (
    <main
      className={`${
        isPrivate ? offlineStyle.disableWhenOffline : ''
      } offlineWrapper`}
    >
      <ErrorBoundary
        errorMessage={t('An error occurred while rendering this page')}
      >
        <Route
          path={isNetworkSet ? path : routes.manageAccounts.path}
          exact={exact}
          key={isNetworkSet ? path : routes.manageAccounts.path}
          component={isNetworkSet ? component : ManageAccounts}
        />
      </ErrorBoundary>
    </main>
  );
};

CustomRoute.defaultProps = {
  t: (str) => str,
  pathSuffix: '',
  pathPrefix: '',
};

export default CustomRoute;
