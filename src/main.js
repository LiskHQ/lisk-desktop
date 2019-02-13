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

function loadRemoteComponent(url){
  return fetch(url)
  .then(res=>res.text())
  .then(source=>{
    console.log(source);
    var exports = {}
    function require(name){

      if(name == 'react') return React 
      else throw `You can't use modules other than "react" in remote component.`
      if(name == 'LiskHubExtensions') return LiskHubExtensions
    }
    // const transformedSource = transform(source, {
    //   presets: ['react', 'es2015', 'stage-2']
    // }).code
    // console.log(transformedSource, 'transformedSource');
    // eval(transformedSource)
    eval(source);
    // traverse(componentRegistry, this.componentName);
    // return source;
    return exports.__esModule ? exports.default : exports
  })
}

/*
 * TODO all code below this point is a sample extensions
 * that should be loaded by the "Add extension " page as a separate <script>
 */
const HelloWorldModule = props => {
  return (
    <div style={{ marginTop: 20 }} > {/* TODO avoid the style here */}
      <LiskHubExtensions.components.Box>
        <h2> {props.t('Hello Lisk Hub Extensions!')} </h2>
        <LiskHubExtensions.components.Button label={props.t('Sample Button')} />
        {loadRemoteComponent('https://gist.githubusercontent.com/michaeltomasik/67563192c6fa4cd362379a09f2b8099b/raw/64ab78b10da3eee713fa0377e17911324d51bf59/script.js').then((Hello) => {
          console.log(LiskHubExtensions, props);
          ReactDOM.render(<Hello name='MIKE' t={props.t}/> , document.getElementById('dashboard-column-2'))
        }).bind(props)}
      </LiskHubExtensions.components.Box>
    </div>
  );
}

LiskHubExtensions.addModule({
  identifier: LiskHubExtensions.identifiers.dashboardColumn1,
  component: HelloWorldModule,
});
