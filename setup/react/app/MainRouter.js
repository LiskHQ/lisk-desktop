import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import useWalletConnectEventsManager from '@libs/wcm/hooks/useConnectionEventsManager';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import routesMap from 'src/routes/routesMap';
import NotFound from 'src/modules/common/components/NotFound';
import CustomRoute from 'src/modules/common/components/customRoute';
import routes from 'src/routes/routes';
import styles from './app.css';

const MainRouter = ({ history }) => {
  const { events } = useContext(ConnectionContext);
  useWalletConnectEventsManager();

  useEffect(() => {
    if (events.length && events[events.length - 1].name === EVENTS.SESSION_REQUEST) {
      addSearchParamsToUrl(history, { modal: 'requestView' });
    }
  }, [events]);

  return (
    <div className={`${styles.mainContent} ${styles.mainBox}`}>
      <Switch>
        {
          Object.entries(routes).map(([key, route]) => (
            <CustomRoute
              key={route.path}
              route={route}
              path={route.path}
              exact={route.exact}
              isPrivate={route.isPrivate}
              forbiddenTokens={route.forbiddenTokens}
              component={routesMap[key]}
              history={history}
            />
          ))
        }
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(MainRouter);
