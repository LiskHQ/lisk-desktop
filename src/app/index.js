/* istanbul ignore file */
// This is covered by e2e tests
import React, { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hot } from 'react-hot-loader/root';
import './variables.css';
import OfflineWrapper from '@shared/offlineWrapper';
import CustomRoute from '@shared/customRoute';
import NotFound from '@shared/notFound';
import { routes } from '@constants';
import NavigationBars from '@shared/navigationBars';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import DialogHolder from '@toolbox/dialog/holder';
import { settingsRetrieved, bookmarksRetrieved, watchListRetrieved } from '@actions';
import ThemeContext from '../contexts/theme';
import styles from './app.css';
import useIpc from '../hooks/useIpc';

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

  const routesList = Object.values(routes);
  const routeObj = routesList.find(r => r.path === history.location.pathname) || {};

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
            {/* <InitializationMessage history={history} /> */}
            <div className={`${styles.mainContent} ${styles.mainBox}`}>
              <Switch>
                {
                  routesList.map(route => (
                    <CustomRoute
                      route={route}
                      path={route.path}
                      exact={route.exact}
                      isPrivate={route.isPrivate}
                      forbiddenTokens={route.forbiddenTokens}
                      component={route.component}
                      key={route.path}
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
