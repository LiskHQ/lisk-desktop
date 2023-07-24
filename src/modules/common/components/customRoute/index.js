/* eslint-disable complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import Piwik from 'src/utils/piwik';
import routes from 'src/routes/routes';
import offlineStyle from 'src/modules/common/components/offlineWrapper/offlineWrapper.css';
import { useCheckLegacyAccount } from '@legacy/hooks/queries';
import useSettings from '@settings/hooks/useSettings';
import ErrorBoundary from './errorBoundary';

// eslint-disable-next-line max-statements
const CustomRoute = ({ path, exact, isPrivate, forbiddenTokens, component, t, history }) => {
  const token = useSelector((state) => state.token);
  const [currentAccount] = useCurrentAccount();
  const { pubkey, address, isHW } = currentAccount?.metadata || {};
  const isAuthenticated = !!address;
  const { isMigrated } = useCheckLegacyAccount(pubkey);
  const { search = '' } = history.location;
  const { accounts } = useAccounts();
  const { mainChainNetwork } = useSettings('mainChainNetwork');

  Piwik.tracking(history, token);

  if (!mainChainNetwork && path !== routes.selectNetwork.path) {
    return <Redirect to={routes.selectNetwork.path} />;
  }

  if (forbiddenTokens.indexOf(token.active) !== -1) {
    return <Redirect to={routes.wallet.path} />;
  }

  if (!isAuthenticated && path === routes.manageAccounts.path && accounts.length === 0) {
    return <Redirect to={{ pathname: routes.wallet.path, search }} />;
  }

  if (isPrivate && !isAuthenticated) {
    const searchString = `?referrer=${path}${search.replace(/^\?/, '&')}`;
    return <Redirect to={`${routes.manageAccounts.path}${searchString}`} />;
  }

  // Redirect back to actual path when an account is not reclaimable
  if (isMigrated && path === routes.reclaim.path) {
    return <Redirect to={`${routes.wallet.path}`} />;
  }

  // Redirect back to wallet page when current account isHW and somehow has ended up on backupRecoveryPhraseFlow
  if (isHW && path === routes.backupRecoveryPhraseFlow.path) {
    return <Redirect to={`${routes.wallet.path}`} />;
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
        <Route path={path} exact={exact} key={path} component={component} />
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
