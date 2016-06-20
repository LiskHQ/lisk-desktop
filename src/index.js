
import 'angular-material-data-table/dist/md-data-table.js'
import 'angular-material-data-table/dist/md-data-table.css'

import './index.less'

import './app'

import './theme/theme'
import './util/animateOnChange/animateOnChange'
import './components/main/main'
import './components/login/login'
import './components/top/top'
import './components/send/send'
import './components/transactions/transactions'
import './components/timestamp/timestamp'
import './components/lsk/lsk'
import './components/address/address'

import './services/error'
import './services/lsk'
import './services/peer'
import './services/peers'
import './services/success'
import './services/timestamp'

import './filters/lsk'
import './filters/timestamp'

import angular from 'angular'

angular.element(document).ready(() => {
  angular.bootstrap(document, ['app'])
})
