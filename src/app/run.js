app.run(($rootScope, $timeout, $transitions, $mdDialog, $peers, Account) => {
  $rootScope.peers = $peers;

  $transitions.onStart( { to: '*' }, (trans) => {
    $mdDialog.cancel();
  });

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
