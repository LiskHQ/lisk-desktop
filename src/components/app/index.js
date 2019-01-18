import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { isPathCorrect } from '../../utils/app';
import styles from './app.css';
import stylesV2 from './appV2.css';
import Toaster from '../toaster';
import MainMenu from '../mainMenuV2';
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

    const routesV2Layout = allRoutes.filter(routeObj => routeObj.isV2Layout);

    const routesOutsideMainWrapper = [
      'registerDelegate',
      'register',
      'addAccount',
      'login',
    ];

    const { location } = this.props;

    return (
      <OfflineWrapper>
        <Onboarding appLoaded={this.state.loaded} />
        <Dialog />
        {
          routesV2Layout.filter(route => route.path === location.pathname).length > 0
          ? (
            <main className={this.state.loaded ?
              `${stylesV2.v2Wrapper} ${stylesV2.loaded} appLoaded` :
              `${styles.v2Wrapper}`
            } ref={(el) => { this.main = el; }}>
              <Switch>
                {this.state.loaded &&
                  routesV2Layout.map((route, key) => (
                    <Route
                      path={route.path}
                      key={key}
                      component={route.component}
                    />
                  ))
                }
              </Switch>
              <Toaster />
            </main>
          ) : (
            <main className={this.state.loaded ?
              `${styles.bodyWrapper} ${styles.loaded} appLoaded` :
              `${styles.bodyWrapper}`
            } ref={(el) => { this.main = el; }}>
              <MainMenu />
              <section>
                <div className={styles.mainBox}>
                  <Header />
                  <div id='onboardingAnchor'></div>
                  <Switch>
                    {this.state.loaded &&
                      <Route path={routes.explorer.path} component={() => (
                        isPathCorrect(location, explorerRoutes) && (
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
                        )
                      )} />
                    }
                    {this.state.loaded &&
                      defaultRoutes.map((route, key) => (
                        <CustomRoute
                          path={route.path}
                          pathSuffix={route.pathSuffix}
                          component={route.component}
                          isPrivate={route.isPrivate}
                          exact={route.exact}
                          key={key} />
                      ))
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
          )
        }
        <LoadingBar markAsLoaded={this.markAsLoaded.bind(this)} />
      </OfflineWrapper>
    );
  }
}

export default withRouter(App);
