/**
 * The directive to show the second passphrase form and register it using AccountApi
 *
 * @module app
 * @submodule SetSecondPassCtrl
 */
app.component('newAccount', {
  bindings: {
    network: '=',
    closeDialog: '&',
  },
  template: require('./newAccount.pug')(),
  controller($scope, Account, $rootScope, $cookies,
    Passphrase, $state, Peers) {
    /**
     * We call this after second passphrase is generated.
     * Shows an alert with appropriate message in case the request fails.
     *
     * @param {String} passphrase - The validated passphrase to register as primary passphrase
     */
    $scope.passConfirmSubmit = (passphrase) => {
      $rootScope.loggingIn = true;
      $scope.$emit('showLoadingBar');
      Peers.setActive(this.network).then(() => {
        $rootScope.loggingIn = false;
        $scope.$emit('hideLoadingBar');
        if (Peers.online) {
          Account.set({
            passphrase,
            network: this.network,
          });
          $cookies.put('network', JSON.stringify(this.network));
          $state.go($rootScope.landingUrl || 'main.transactions');
        }
      });
    };

    $scope.onSave = (passphrase) => {
      $scope.passConfirmSubmit(passphrase);
    };

    $scope.cancel = () => {
      this.closeDialog();
    };
  },
  // controllerAs: 'md',
});
