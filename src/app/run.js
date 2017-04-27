app.run(($rootScope, $timeout, $state, $peers, Account) => {
  $rootScope.peers = $peers;

  $rootScope.reset = () => {
    $timeout.cancel($rootScope.timeout);
  };

  $rootScope.logout = () => {
    $rootScope.reset();
    $peers.reset(true);

    $rootScope.logged = false;
    $rootScope.prelogged = false;
    Account.reset();

    $state.go('login');
  };
});
