import './top.less';

app.component('top', {
  template: require('./top.pug')(),
  bindings: {
    account: '<',
  },
  controller: class top {
    constructor($peers, $scope) {
      this.$peers = $peers;

      $scope.$watch('$ctrl.$peers.currentPeerConfig', () => {
        this.$peers.setActive(this.$peers.currentPeerConfig);
      });
    }
  },
});
