import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styles from './app.css';
import Toaster from '../toaster';
import MainMenu from '../mainMenu';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import CustomRoute from '../customRoute';
import Header from '../header';
import SavedAccounts from '../savedAccounts';
import NotFound from '../notFound';

import routes from '../../constants/routes';
import Onboarding from '../onboarding';

class App extends React.Component {
  markAsLoaded() {
    this.main.classList.add(styles.loaded);
    this.main.classList.add('appLoaded');
    this.appLoaded = true;
  }

  startOnboarding() {
    this.onboarding.setState({ start: true });
  }

  render() {
    const allRoutes = Object.values(routes);

    const defaultRoutes = allRoutes.filter(routeObj =>
      routeObj.component && !routeObj.pathPrefix);
    const explorerRoutes = allRoutes.filter(routeObj =>
      routeObj.pathPrefix && routeObj.pathPrefix === routes.explorer.path);

    return (
      <OfflineWrapper>
        <Onboarding appLoaded={this.appLoaded} ref={(el) => {
          if (el) { this.onboarding = el.getWrappedInstance().getWrappedInstance(); }
        }} />
        <main className={`${styles.bodyWrapper}`} ref={(el) => { this.main = el; }}>
          <MainMenu startOnboarding={this.startOnboarding.bind(this)}/>
          <Route path={routes.accounts.path} component={SavedAccounts} />
          <section>
            <div className={styles.mainBox}>
              <Header/>
              <div id='onboardingAnchor'></div>
              <Switch>
                <Route path={routes.explorer.path} render={ () => (
                  explorerRoutes.map((route, key) => (
                    <CustomRoute
                      pathPrefix={route.pathPrefix}
                      path={route.path}
                      pathSuffix={route.pathSuffix}
                      component={route.component}
                      isPrivate={route.isPrivate}
                      exact={route.exact}
                      key={key} />
                  ))
                )} />
                {defaultRoutes.map((route, key) => (
                  <CustomRoute
                    path={route.path}
                    pathSuffix={route.pathSuffix}
                    component={route.component}
                    isPrivate={route.isPrivate}
                    exact={route.exact}
                    key={key} />
                ))}
                <Route component={NotFound} />
              </Switch>
            </div>
            <Toaster />
            <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
          </section>
        </main>
      </OfflineWrapper>
    );
  }
}

export default App;
