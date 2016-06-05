
import './index.less'

import './app'

import './theme/theme'
import './services/account'
import './components/animateOnChange/animateOnChange'
import './components/wallet/wallet'
import './components/login/login'
import './components/account/account'
import './components/send/send'

import $ from 'jquery'
import angular from 'angular'

angular.element(document).ready(() => {
  setTimeout(() => {
    $('.preloading').remove()
    angular.bootstrap(document, ['app'])
  }, 1000)
})
