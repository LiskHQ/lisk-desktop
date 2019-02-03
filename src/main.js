import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { applyDeviceClass } from './utils/applyDeviceClass';
import App from './components/app';
// import history from './history';
import store from './store';
import i18n from './i18n'; // initialized i18next instance
import proxyLogin from './utils/proxyLogin';
import externalLinks from './utils/externalLinks';
import env from './constants/env';
import ipcLocale from './utils/ipcLocale';
import LiskHubExtensions from './utils/liskHubExtensions';

if (env.production) {
  proxyLogin.init();
  ipcLocale.init(i18n);
  externalLinks.init();
}

const rootElement = document.getElementById('app');


const renderWithRouter = Component =>
  <Provider store={store}>
    <Router>
      <I18nextProvider i18n={ i18n }>
        <Component />
      </I18nextProvider>
    </Router>
  </Provider>;

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./components/app', () => {
    const NextRootContainer = require('./components/app').default;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}

applyDeviceClass(document.getElementsByTagName('html')[0], navigator);

window.LiskHubExtensions = LiskHubExtensions;

/*
 * TODO all code below this point is a sample extensions
 * that should be loaded by the "Add extension " page as a separate <script>
 */
const HelloWorldModule = props => <div style={{ marginTop: 20 }} > {/* TODO avoid the style here */}
  <LiskHubExtensions.components.Box>
    <h2> {props.t('Hello Lisk Hub Extensions!')} </h2>
    <LiskHubExtensions.components.Button label={props.t('Sample Button')} />
  </LiskHubExtensions.components.Box>
</div>;

LiskHubExtensions.addModule({
  identifier: LiskHubExtensions.identifiers.dashboardColumn1,
  component: HelloWorldModule,
});
