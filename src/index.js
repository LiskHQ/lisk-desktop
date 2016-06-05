
import './index.less'
import './app'
import './theme'
import './components/main'
import './components/account'
import './components/animateOnChange/animateOnChange'
import './components/login/login'
import './components/wallet/wallet'

import angular from 'angular'

angular.element(document).ready(() => {
  angular.bootstrap(document, ['app'])
})
