import './components/main/main';
import './components/login/login';

app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $stateProvider.
    state('login', {
        url: '/',
        component: 'login',
    }).
    state('main', {
        url: '/main',
        component: 'main',
    });
    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);
});
