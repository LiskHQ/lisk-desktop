import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import styles from './app.css';
import stylesV2 from './appV2.css';
import Toaster from '../toaster';
import TopBar from '../topBar';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import CustomRoute from '../customRoute';
import Dialog from '../dialog';
import NotFound from '../notFound';
import Message from '../message';
import routes from '../../constants/routes';
// eslint-disable-next-line import/no-named-as-default

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
    const { history, location } = this.props;
    const allRoutes = Object.values(routes);
    const defaultRoutes = allRoutes.filter(routeObj => routeObj.component);
    const routesV2Layout = allRoutes.filter(routeObj => routeObj.isV2Layout);

    return (
      <OfflineWrapper>
        <Dialog />
        {
          routesV2Layout.filter(route => route.path === location.pathname).length > 0
            ? (
              <main
                className={this.state.loaded
                  ? `${stylesV2.v2Wrapper} ${styles.loaded} appLoaded`
                  : `${styles.v2Wrapper}`}
                ref={(el) => { this.main = el; }}
              >
                <Switch>
                  {
                    this.state.loaded && routesV2Layout.map((route, key) => (
                      <Route
                        path={route.path}
                        key={key}
                        component={route.component}
                        exact={route.exact}
                      />
                    ))
                  }
                </Switch>
                <Toaster />
              </main>
            )
            : (
              <main
                className={this.state.loaded
                  ? `${styles.bodyWrapper} ${styles.loaded} appLoaded`
                  : `${styles.bodyWrapper}`}
                ref={(el) => { this.main = el; }}
              >
                <TopBar />
                <section>
                  <Message history={history} />
                  <div className={styles.mainBox}>
                    <Switch>
                      {
                        this.state.loaded && defaultRoutes.map(route => (
                          <CustomRoute
                            path={route.path}
                            pathSuffix={route.pathSuffix}
                            component={route.component}
                            isPrivate={route.isPrivate}
                            exact={route.exact}
                            forbiddenTokens={route.forbiddenTokens}
                            key={route.path}
                          />
                        ))
                      }
                      <Route path="*" component={NotFound} />
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
