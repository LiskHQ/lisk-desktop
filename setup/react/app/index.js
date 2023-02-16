/* istanbul ignore file */
// This is covered by e2e tests
import React, { useEffect, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { settingsRetrieved } from 'src/modules/settings/store/actions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hot } from 'react-hot-loader/root';
import { bookmarksRetrieved } from 'src/modules/bookmark/store/action';
import { watchListRetrieved } from 'src/modules/pos/validator/store/actions/watchList';
import NotFound from 'src/modules/common/components/NotFound';
import useIpc from '@update/hooks/useIpc';
import ConnectionProvider from '@libs/wcm/context/connectionProvider';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import client from 'src/utils/api/client';
import DialogHolder from 'src/theme/dialog/holder';
import OfflineWrapper from 'src/modules/common/components/offlineWrapper';
import CustomRoute from 'src/modules/common/components/customRoute';
import NavigationBars from 'src/modules/common/components/bars';
import ThemeContext from 'src/theme/themeProvider';
import routesMap from 'src/routes/routesMap';
import { useTransactionUpdate } from '@transaction/hooks';
import routes from 'src/routes/routes';
import { MOCK_SERVICE_WORKER } from 'src/const/config';
import { useBlockchainApplicationMeta } from 'src/modules/blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import {
  useApplicationManagement,
  useCurrentApplication,
} from 'src/modules/blockchainApplication/manage/hooks';
import './variables.css';
import useHwListener from "@hardwareWallet/hooks/useHwListener";
import styles from './app.css';

if (MOCK_SERVICE_WORKER) {
  const { worker } = require('src/service/mock/runtime');

  worker.start({ onUnhandledRequest: 'bypass' });
}

// eslint-disable-next-line max-statements
const App = ({ history }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const theme = useSelector((state) => (state.settings.darkMode ? 'dark' : 'light'));
  const { data: chainMetaData, isLoading } = useBlockchainApplicationMeta();
  const { setApplication } = useApplicationManagement();
  const [, setCurrentApplication] = useCurrentApplication();
  useHwListener();
  useIpc(history);

  useEffect(() => {
    setLoaded(true);
    // Initialize client on first render to get default application
    client.create({
      http: 'http://165.227.246.146:9901',
      ws: 'ws://165.227.246.146:9901',
    });
    dispatch(bookmarksRetrieved());
    dispatch(settingsRetrieved());
    dispatch(watchListRetrieved());
  }, []);

  useEffect(() => {
    if (!isLoading && chainMetaData) {
      chainMetaData.data.map((data) => setApplication(data));
      setCurrentApplication(chainMetaData.data[0]);
    }
  }, [isLoading, chainMetaData]);
  useTransactionUpdate(loaded);

  const routesList = Object.keys(routes);
  const routeObj = Object.values(routes).find((r) => r.path === history.location.pathname) || {};
  return (
    <ConnectionProvider>
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
            </section>
          </main>
        </OfflineWrapper>
      </ThemeContext.Provider>
    </ConnectionProvider>
  );
};

export default withRouter(App);
export const DevApp = hot(withRouter(App));
