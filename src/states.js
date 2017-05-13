import './components/main/main';
import './components/login/login';

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('login', {
      url: '/',
      component: 'login',
    })
    .state('main', {
      url: '/main',
      component: 'main',
    })
    .state('main.transactions', {
      url: '/transactions',
      component: 'transactions',
    })
    .state('main.voting', {
      url: '/voting',
      component: 'delegates',
    })
    .state('main.forging', {
      url: '/forging',
      component: 'forging',
    });
  $urlRouterProvider.otherwise('/');
});
