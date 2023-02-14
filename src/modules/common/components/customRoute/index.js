/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import Piwik from 'src/utils/piwik';
import routes from 'src/routes/routes';
import Login from '@auth/components/Signin';
import offlineStyle from 'src/modules/common/components/offlineWrapper/offlineWrapper.css';
import { useCheckLegacyAccount } from '@legacy/hooks/queries';
import ErrorBoundary from './errorBoundary';

const checkNetwork = (state) =>
  !!state.network.name &&
  !!(state.network.networks && state.network.networks.LSK && state.network.networks.LSK.serviceUrl);

// eslint-disable-next-line max-statements
const CustomRoute = ({ path, exact, isPrivate, forbiddenTokens, component, t, history }) => {
  const token = useSelector((state) => state.token);
  const isNetworkSet = useSelector(checkNetwork);
  const [currentAccount] = useCurrentAccount();
  const isAuthenticated = !!currentAccount?.metadata?.address;
  const { isMigrated } = useCheckLegacyAccount(currentAccount?.metadata?.pubkey);
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
    // @todo: Fix in #4537
    return (
      <Redirect
        to={`${routes.manageAccounts.path}?referrer=${path.replace(
          /\/(send|stake)/,
          ''
        )}&${search.replace(/^\?/, '')}`}
      />
    );
  }

  // Redirect back to actual path when an account is not reclaimable
  if (isMigrated && path === routes.reclaim.path) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  if (
    isMigrated === false &&
    ![
      routes.reclaim.path,
      routes.backupRecoveryPhraseFlow.path,
      routes.manageAccounts.path,
      routes.addAccountOptions.path,
      routes.addAccountByFile.path,
      routes.addAccountBySecretRecovery.path,
    ].includes(history.location.pathname) &&
    isAuthenticated
  ) {
    return <Redirect to={`${routes.reclaim.path}`} />;
  }

  return (
    <main className={`${isPrivate ? offlineStyle.disableWhenOffline : ''} offlineWrapper`}>
      <ErrorBoundary errorMessage={t('An error occurred while rendering this page')}>
        <Route
          path={isNetworkSet ? path : routes.manageAccounts.path}
          exact={exact}
          key={isNetworkSet ? path : routes.manageAccounts.path}
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
