
import './top.less'

import app from '../../app'

app.component('top', {
  template: require('./top.jade')(),
  bindings: {
    account: '<',
    peer: '=',
  },
  controller: class top {
    constructor ($scope, $rootScope, peers) {
      this.peers = peers.official

      $scope.$watch('$ctrl.peer', (peer, old) => {
        if (peer != old) {
          $rootScope.$broadcast('peerUpdate')
        }
      })
    }
  }
})
