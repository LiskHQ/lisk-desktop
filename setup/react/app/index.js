/* istanbul ignore file */
// This is covered by e2e tests
import React, { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hot } from 'react-hot-loader/root';
import './variables.css';
import OfflineWrapper from '@basics/offlineWrapper';
import CustomRoute from '@views/shared/customRoute';
import NotFound from '@views/shared/notFound';
import NavigationBars from '@views/shared/navigationBars';
import FlashMessageHolder from '@basics/flashMessage/holder';
import DialogHolder from '@basics/dialog/holder';
import { settingsRetrieved, bookmarksRetrieved, watchListRetrieved } from '@common/store/actions';
import routesMap from '@views/screens/router/routesMap';
import { routes } from '@common/configuration';
import ThemeContext from '@common/contexts/theme';
import useIpc from '@updater/hooks/useIpc';
import styles from './app.css';

// eslint-disable-next-line max-statements
const App = ({ history }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const theme = useSelector(state => (state.settings.darkMode ? 'dark' : 'light'));

  useIpc(history);

  useEffect(() => {
    setLoaded(true);
    dispatch(bookmarksRetrieved());
    dispatch(settingsRetrieved());
    dispatch(watchListRetrieved());
  }, []);

  const routesList = Object.keys(routes);
  const routeObj = Object.values(routes).find(r => r.path === history.location.pathname) || {};

  return (
    <ThemeContext.Provider value={theme}>
      <OfflineWrapper>
        <DialogHolder history={history} />
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          draggable
          newestOnTop
          closeButton={false}
          className={styles.toastContainer}
          toastClassName={styles.toastBody}
          bodyClassName={styles.toastText}
        />
        <NavigationBars
          isSignInFlow={routeObj.isSigninFlow}
          location={history.location}
          history={history}
        />
        <main className={`${styles.bodyWrapper} ${loaded ? styles.loaded : ''}`}>
          <section className="scrollContainer">
            <FlashMessageHolder />
            <div className={`${styles.mainContent} ${styles.mainBox}`}>
              <Switch>
                {
                  routesList.map(route => (
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
                  ))
                }
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </section>
        </main>
      </OfflineWrapper>
    </ThemeContext.Provider>
  );
};

export default withRouter(App);
export const DevApp = hot(withRouter(App));
