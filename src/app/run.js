app.run(($rootScope, $timeout, $state, $peers) => {
    $rootScope.peers = $peers;

    $rootScope.reset = () => {
      $timeout.cancel($rootScope.timeout);
    }
    
    $rootScope.logout = () => {
      $rootScope.reset();
      $peers.reset(true);

      $rootScope.logged = false;
      $rootScope.prelogged = false;
      $rootScope.account = {};
      $rootScope.passphrase = '';

      $state.go('login');
    }
});