import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import ErrorBoundary from '../errorBoundary';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import Piwik from '../../../utils/piwik';
import routes, { modals } from '../../../constants/routes';
import { parseSearchParams } from '../../../utils/searchParams';
import DialogHolder from '../../toolbox/dialog/holder';

const Content = ({
  t, isPrivate, pathPrefix, path, pathSuffix, component, exact,
}) => (
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
  const { search = '' } = history.location;

  const { modal: modalQuery, tab: tabQuery } = parseSearchParams(history.location.search);

  if (!networkIsSet) return null;
  Piwik.tracking(history, settings);

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

  if (modalQuery) {
    const modal = modals[modalQuery];
    const Component = modal.component;
    const page = history.location.pathname;

    if (modal.allowedOnlyOnPages) {
      if (modal.allowedOnlyOnPages.includes(page)) {
        DialogHolder.showDialog(<Component t={t} />, modalQuery);
      }
    } else {
      DialogHolder.showDialog(<Component t={t} />, modalQuery);
    }
  }

  if (tabQuery) {
    // save the tab in the state and implement tab activation  in the tables etc through the state
  }
  return (
    <Content
      t={t}
      isPrivate={isPrivate}
      component={component}
      exact={exact}
      path={path}
      pathPrefix={pathPrefix}
      pathSuffix={pathSuffix}
    />
  );
};

CustomRoute.defaultProps = {
  t: str => str,
  pathSuffix: '',
  pathPrefix: '',
};

export default CustomRoute;
