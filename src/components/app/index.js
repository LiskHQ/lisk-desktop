import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import styles from './app.css';
import Toaster from '../toaster';
import TopBar from '../topBar';
import LoadingBar from '../loadingBar';
import OfflineWrapper from '../offlineWrapper';
import CustomRoute from '../customRoute';
import Dialog from '../dialog';
import NotFound from '../notFound';
import InitializationMessage from '../initializationMessage';
import routes from '../../constants/routes';

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
    const signinFlowRoutes = allRoutes.filter(routeObj => routeObj.isSigninFlow);

    return (
      <OfflineWrapper>
        <Dialog />
        {
          signinFlowRoutes.filter(route => route.path === location.pathname).length > 0
            ? (
              <main
                className={this.state.loaded
                  ? `${styles.wrapper} ${styles.loaded} appLoaded`
                  : `${styles.wrapper}`
                }
                ref={(el) => { this.main = el; }}
              >
                <Switch>
                  {this.state.loaded
                  && signinFlowRoutes.map((route, key) => (
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
                  <InitializationMessage history={history} />
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
