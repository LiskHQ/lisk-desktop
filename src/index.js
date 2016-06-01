
import './css'

import $ from 'jquery'
import angular from 'angular'

import './js/controllers'
import './js/directives'
import './js/filters'

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
