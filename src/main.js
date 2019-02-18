import React from 'react';
import { transform } from "@babel/core";
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
import localJSONStorage from './utils/localJSONStorage';
import { loadRemoteComponent } from './utils/extensions';
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

const traverseInternal = (object, keys, keyIndex) => {
  if (keyIndex >= keys.length) {
    return object;
  }

  return traverseInternal(object[keys[keyIndex]], keys, keyIndex + 1);
};

const traverse = (object, deepKey) => {
  return traverseInternal(object, deepKey.split('.'), 0);
};

const urls = localJSONStorage.get('url', []);

console.log(urls, window.localStorage.getItem('url'), 'URLS');

urls.forEach(url => {
  console.log(url);
  loadRemoteComponent(url);
});

// loadRemoteComponent('https://codepen.io/michaeltomasik/pen/NozxqG.js')

/*
 * TODO all code below this point is a sample extensions
 * that should be loaded by the "Add extension " page as a separate <script>
 */
// import React from 'react'
// import LiskHubExtensions from 'LiskHubExtensions'

// class Hello extends React.Component {
//   render () {
//     return (<h1>Hello {this.props.name}!
//         <LiskHubExtensions.components.Button
// onClick={() => {
//   console.log('onClick', this.props);
//   this.props.onClick();
// }}
// label={this.props.t('Sample Button')} />
//     </h1>);
//   }
// }

// LiskHubExtensions.addModule({
//   identifier: LiskHubExtensions.identifiers.dashboardColumn1,
//   component: Hello,
// });