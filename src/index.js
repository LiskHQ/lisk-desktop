
import './css'

import $ from 'jquery'
import angular from 'angular'

let app = angular.module('app', [
  'ngMaterial',
])

require('./controller/main').default(app)

require('./directive/login/login').default(app)

setTimeout(() => {
  $('.preloading').remove()

  angular.element(document).ready(() => {
    angular.bootstrap(document, ['app'])
  })
}, 1)
