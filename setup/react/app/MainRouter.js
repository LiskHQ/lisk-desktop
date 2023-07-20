import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import routesMap from 'src/routes/routesMap';
import NotFound from 'src/modules/common/components/NotFound';
import CustomRoute from 'src/modules/common/components/customRoute';
import routes from 'src/routes/routes';
import styles from './app.css';

const MainRouter = ({ history }) => {
  const { events } = useEvents();
  const routesList = Object.keys(routes);

  useEffect(() => {
    const event = events.length && events[events.length - 1];

    if (event.name === EVENTS.SESSION_REQUEST) {
      const method = event.meta?.params?.request?.method;

      if (method === 'sign_message') {
        addSearchParamsToUrl(history, { modal: 'requestSignMessageDialog' });
      } else {
        addSearchParamsToUrl(history, { modal: 'requestView' });
      }
    }
  }, [events]);

  return (
    <div className={`${styles.mainContent} ${styles.mainBox}`}>
      <Switch>
        {routesList.map((route) => (
          <CustomRoute
            key={routes[route].path}
            route={routes[route]}
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
