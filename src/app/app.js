/**
 * The main application
 * This is an Angular module to nest all the other submodules
 * and also to apply routing.
 *
 * @namespace app
 */
const app = angular.module('app', [
  'ui.router',
  'angular-svg-round-progressbar',
  'ngMessages',
  'ngMaterial',
  'ngAnimate',
  'ngCookies',
  'infinite-scroll',
  'md.data.table',
]);

export default app;
