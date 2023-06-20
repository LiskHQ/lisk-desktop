/* istanbul ignore file */
// This is covered by e2e tests
import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { settingsRetrieved } from 'src/modules/settings/store/actions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hot } from 'react-hot-loader/root';
import { bookmarksRetrieved } from 'src/modules/bookmark/store/action';
import { watchListRetrieved } from 'src/modules/pos/validator/store/actions/watchList';
import useIpc from '@update/hooks/useIpc';
import ConnectionProvider from '@libs/wcm/context/connectionProvider';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import DialogHolder from 'src/theme/dialog/holder';
import OfflineWrapper from 'src/modules/common/components/offlineWrapper';
import NavigationBars from 'src/modules/common/components/bars';
import ThemeContext from 'src/theme/themeProvider';
import routes from 'src/routes/routes';
import { MOCK_SERVICE_WORKER } from 'src/const/config';
import NetworkError from 'src/modules/common/components/NetworkError/NetworkError';
import PageLoader from 'src/modules/common/components/pageLoader';
import MainRouter from './MainRouter';
import './variables.css';
import styles from './app.css';
import { ApplicationBootstrapContext } from './ApplicationBootstrap';

if (MOCK_SERVICE_WORKER) {
  const { worker } = require('src/service/mock/runtime');

  worker.start({ onUnhandledRequest: 'bypass' });
}

const AppContent = () => {
  const { hasNetworkError, refetchNetwork, error, isLoadingNetwork } = useContext(
    ApplicationBootstrapContext
  );

  if (isLoadingNetwork) return <PageLoader />;

  return hasNetworkError ? <NetworkError onRetry={refetchNetwork} error={error} /> : <MainRouter />;
};

// eslint-disable-next-line max-statements
const App = ({ history }) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const theme = useSelector((state) => (state.settings.darkMode ? 'dark' : 'light'));

  useIpc(history);

  useEffect(() => {
    setLoaded(true);
    dispatch(bookmarksRetrieved());
    dispatch(settingsRetrieved());
    dispatch(watchListRetrieved());
  }, []);

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
              <AppContent />
            </section>
          </main>
        </OfflineWrapper>
      </ThemeContext.Provider>
    </ConnectionProvider>
  );
};

export default withRouter(App);
export const DevApp = hot(withRouter(App));
