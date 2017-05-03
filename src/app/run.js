app.run(($rootScope, $timeout, $state, $transitions, $mdDialog, $peers, Account) => {
  $rootScope.peers = $peers;

  $transitions.onStart({ to: '*' }, () => {
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
