/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import Piwik from '../../../utils/piwik';
import routes from '../../../constants/routes';
import { hasEnoughBalanceForInitialization } from '../../../utils/account';
import { selectSearchParamValue } from '../../../utils/searchParams';

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
  const { search = '' } = history.location;

  const settings = useSelector(state => state.settings);
  const account = useSelector(state => state.account);
  const networkIsSet = useSelector(state => !!state.network.name && !!state.network.serviceUrl);
  const hasPendingTransactions = useSelector(state => Boolean(state.transactions.pending.length));

  const isAuthenticated = account.info && account.info[settings.token.active];
  const isAccountInitialised = account.info
    && account.info.LSK
    && account.info.LSK.serverPublicKey;

  if (!networkIsSet) {
    return null;
  }

  Piwik.tracking(history, settings);

  if (
    isAuthenticated
    && !isAccountInitialised
    && hasEnoughBalanceForInitialization(account.info.LSK.balance)
    && history.location.pathname !== routes.initialization.path
    && !selectSearchParamValue(history.location.search, 'initialization')
    && !hasPendingTransactions
  ) {
    return (
      <Redirect to={routes.initialization.path} />
    );
  }

  if (forbiddenTokens.indexOf(settings.token.active) !== -1) {
    return <Redirect to={`${routes.dashboard.path}`} />;
  }

  if (isPrivate && !isAuthenticated) {
    return (
      <Redirect
        to={`${routes.login.path}?referrer=${path.replace(/\/(send|vote)/, '')}&${search.replace(/^\?/, '')}`}
      />
    );
  }

  return (
    <main className={`${isPrivate ? offlineStyle.disableWhenOffline : ''} offlineWrapper`}>
      <ErrorBoundary errorMessage={t('An error occoured while rendering this page')}>
        <Route
          path={path}
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
