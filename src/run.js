/**
 * @function run
 *
 * @description The application state method.
 */
app.run(($rootScope, $timeout, $state, $transitions, $mdDialog, Peers, Account, Sync, $window) => {
  $rootScope.peers = Peers;
  Sync.init();

  $transitions.onStart({ to: '*' }, () => {
    $mdDialog.cancel();
  });

  $rootScope.reset = () => {
    $timeout.cancel($rootScope.timeout);
  };

  $rootScope.logout = () => {
    $rootScope.reset();
    Peers.reset(true);

    $rootScope.logged = false;
    $rootScope.$emit('hideLoadingBar');
    Account.reset();
    if (PRODUCTION) {
      const { ipc } = $window;
      ipc.removeAllListeners('blur');
      ipc.removeAllListeners('focus');
    }

    $state.go('login');
  };
});
