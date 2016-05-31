
import 'babel-polyfill'

import '../css'

import $ from 'jquery'
import angular from 'angular'

import './controllers'
import './directives'
import './filters'

angular.module('app', [
  'ngMaterial',
  'app.controllers',
  'app.directives',
  'app.filters'
])

setTimeout(() => {
  $('.preloading').remove()

  angular.element(document).ready(() => {
    angular.bootstrap(document, ['app'])
  })
}, 2000)
