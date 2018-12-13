import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { isPathCorrect } from '../../utils/app';
import styles from './app.css';
import Toaster from '../toaster';
import MainMenu from '../mainMenu';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import CustomRoute from '../customRoute';
import Header from '../header';
import Dialog from '../dialog';
import NotFound from '../notFound';

import routes from '../../constants/routes';
// eslint-disable-next-line import/no-named-as-default
import Onboarding from '../onboarding';

class App extends React.Component {
  constructor() {
    super();
    this.state = { loaded: false };
  }

  markAsLoaded() {
    this.main.classList.add(styles.loaded);
    this.main.classList.add('appLoaded');
    this.setState({ loaded: true });
  }

  componentDidMount() {
    this.markAsLoaded();
  }

  render() {
    const allRoutes = Object.values(routes);

    const defaultRoutes = allRoutes.filter(routeObj =>
      routeObj.component && !routeObj.pathPrefix && !routeObj.isLoaded);
    const explorerRoutes = allRoutes.filter(routeObj =>
      routeObj.pathPrefix && routeObj.pathPrefix === routes.explorer.path);

    const routesOutsideMainWrapper = [
      'registerDelegate',
      'register',
      'addAccount',
      'login',
    ];

    return (
      <OfflineWrapper>
        <Onboarding appLoaded={this.state.loaded} />
        <Dialog />
        <main className={`${styles.bodyWrapper}`} ref={(el) => { this.main = el; }}>
          <MainMenu />
          <section>
            <div className={styles.mainBox}>
              <Header />
              <div id='onboardingAnchor'></div>
              <Switch>
                {this.state.loaded ?
                  <Route path={routes.explorer.path} component={ ({ location }) => (
                    isPathCorrect(location, explorerRoutes) ? (
                      <div>
                        {explorerRoutes.map((route, key) => (
                          <CustomRoute
                            pathPrefix={route.pathPrefix}
                            path={route.path}
                            pathSuffix={route.pathSuffix}
                            component={route.component}
                            isPrivate={route.isPrivate}
                            exact={true}
                            key={key} />
                        ))}
                      </div>
                    ) : <Route path='*' component={NotFound} />
                  )} />
                  : null
                }
                {this.state.loaded ?
                  defaultRoutes.map((route, key) => (
                    <CustomRoute
                      path={route.path}
                      pathSuffix={route.pathSuffix}
                      component={route.component}
                      isPrivate={route.isPrivate}
                      exact={route.exact}
                      key={key} />
                  ))
                  : null
                }

                {
                  routesOutsideMainWrapper.map((route, key) => (
                    <CustomRoute
                      path={routes[route].path}
                      component={routes[route].component}
                      isPrivate={false}
                      exact={true}
                      key={key} />
                  ))
                }
                <Route path='*' component={NotFound} />
              </Switch>
            </div>
          </section>
          <Toaster />
        </main>
        <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
      </OfflineWrapper>
    );
  }
}

export default App;
