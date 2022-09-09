/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import Piwik from 'src/utils/piwik';
import routes from 'src/routes/routes';
import Login from '@auth/components/Signin';
import offlineStyle from 'src/modules/common/components/offlineWrapper/offlineWrapper.css';
import ErrorBoundary from './errorBoundary';

const checkNetwork = (state) =>
  !!state.network.name &&
  !!(state.network.networks && state.network.networks.LSK && state.network.networks.LSK.serviceUrl);

// eslint-disable-next-line max-statements
const CustomRoute = ({ path, exact, isPrivate, forbiddenTokens, component, t, history }) => {
  const wallet = useSelector((state) => selectActiveTokenAccount(state));
  const token = useSelector((state) => state.token);
  const isNetworkSet = useSelector(checkNetwork);
  const [account] = useCurrentAccount();
  const isAuthenticated = Object.keys(account).length > 0 || !!wallet.summary;
  const { search = '' } = history.location;
  const { accounts } = useAccounts();

  Piwik.tracking(history, token);

  if (forbiddenTokens.indexOf(token.active) !== -1) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  if (!isAuthenticated && path === routes.manageAccounts.path && !(accounts.length > 0)) {
    history.replace(routes.addAccountOptions.path);
  }

  if (isPrivate && !isAuthenticated) {
    return (
      <Redirect
        to={`${routes.login.path}?referrer=${path.replace(/\/(send|vote)/, '')}&${search.replace(
          /^\?/,
          ''
        )}`}
      />
    );
  }

  if (
    wallet.summary?.isMigrated === false &&
    history.location.pathname !== routes.reclaim.path &&
    history.location.pathname !== routes.login.path &&
    !!wallet.summary
  ) {
    return <Redirect to={`${routes.reclaim.path}`} />;
  }

  return (
    <main className={`${isPrivate ? offlineStyle.disableWhenOffline : ''} offlineWrapper`}>
      <ErrorBoundary errorMessage={t('An error occurred while rendering this page')}>
        <Route
          path={isNetworkSet ? path : routes.login.path}
          exact={exact}
          key={isNetworkSet ? path : routes.login.path}
          component={isNetworkSet ? component : Login}
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
