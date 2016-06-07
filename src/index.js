
import './index.less'

import './app'

import './theme/theme'
import './components/animateOnChange/animateOnChange'
import './components/wallet/wallet'
import './components/login/login'
import './components/account/account'
import './components/send/send'
import './components/history/history'
import './components/balance/balance'
import './components/filters/lsk'
import './components/filters/usd'

import $ from 'jquery'
import angular from 'angular'

angular.element(document).ready(() => {
  setTimeout(() => {
    $('.preloading').remove()
    angular.bootstrap(document, ['app'])
  }, 1000)
})
