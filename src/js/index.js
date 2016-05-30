
import $ from 'jquery'
import angular from 'angular'

import 'angular-material/angular-material.min.css!'
import 'angular-material'

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
