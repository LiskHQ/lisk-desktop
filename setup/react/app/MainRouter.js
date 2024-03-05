import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { addSearchParamsToUrl, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import routesMap from 'src/routes/routesMap';
import NotFound from '@common/components/NotFound';
import CustomRoute from '@common/components/customRoute';
import RewardsNotification from '@common/components/notification/rewardsNotification';
import routes from 'src/routes/routes';
import styles from './app.css';

const MainRouter = ({ history }) => {
  const { events } = useEvents();
  const routesList = Object.keys(routes);

  const showRequestModal = (modalName, event) => {
    removeSearchParamsFromUrl(history, ['modal', 'eventId']);
    setTimeout(() => {
      addSearchParamsToUrl(history, { modal: modalName, eventId: event.meta.id });
    }, 100);
  };

  useEffect(() => {
    const event = events.length && events[events.length - 1];

    if (event.name === EVENTS.SESSION_REQUEST) {
      const method = event.meta?.params?.request?.method;

      if (
        method === SIGNING_METHODS.SIGN_MESSAGE.method ||
        method === SIGNING_METHODS.SIGN_RAW_MESSAGE.method
      ) {
        showRequestModal('requestSignMessageDialog', event);
      } else {
        showRequestModal('requestView', event);
      }
    }
  }, [events]);

  return (
    <div className={`${styles.mainContent} ${styles.mainBox}`}>
      <RewardsNotification />
      <Switch>
        {routesList.map((route) => (
          <CustomRoute
            key={routes[route].path}
            path={routes[route].path}
            exact={routes[route].exact}
            isPrivate={routes[route].isPrivate}
            forbiddenTokens={routes[route].forbiddenTokens}
            component={routesMap[route]}
            history={history}
          />
        ))}
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(MainRouter);
