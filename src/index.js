
import './index.less'
import './app'
import './theme'
import './components/main'
import './components/account'
import './components/animateOnChange/animateOnChange'
import './components/login/login'
import './components/wallet/wallet'

import $ from 'jquery'
import angular from 'angular'

angular.element(document).ready(() => {
  setTimeout(() => {
    $('.preloading').remove()
    angular.bootstrap(document, ['app'])
  }, 1000)
})
