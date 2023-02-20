import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import routesMap from 'src/routes/routesMap';
import NotFound from 'src/modules/common/components/NotFound';
import CustomRoute from 'src/modules/common/components/customRoute';
import routes from 'src/routes/routes';
import styles from './app.css';

const MainRouter = ({ history }) => {
  const { events } = useContext(ConnectionContext);
  const routesList = Object.keys(routes);

  useEffect(() => {
    if (events.length && events[events.length - 1].name === EVENTS.SESSION_REQUEST) {
      addSearchParamsToUrl(history, { modal: 'requestView' });
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
