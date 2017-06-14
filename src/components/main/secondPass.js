import './secondPass.less';

/**
 * The directive to show the second passphrase form and register it using AccountApi
 *
 * @module app
 * @submodule SetSecondPassCtrl
 */
app.component('setSecondPass', {
  template: require('./secondPass.pug')(),
  controller($scope, Account, $rootScope, dialog, AccountApi, $mdDialog) {
    this.fee = 5;
    /**
     * We call this after second passphrase is generated.
     * Shows an alert with appropriate message in case the request fails.
     *
     * @param {String} secondSecret - The validated passphrase to register as second secret
     */
    $scope.passConfirmSubmit = (secondSecret) => {
      AccountApi.setSecondSecret(secondSecret, Account.get().publicKey, Account.get().passphrase)
        .then(() => {
          dialog.successAlert({
            text: 'Second passphrase registration was successfully submitted. It can take several seconds before it is processed.',
          });
        })
        .catch((err) => {
          let text = '';
          if (err.message === 'Missing sender second signature') {
            text = 'You already have a second passphrase.';
          } else if (/^(Account does not have enough LSK)/.test(err.message)) {
            text = 'You have insufficient funds to register a second passphrase.';
          } else {
            text = err.message || 'An error occurred while registering your second passphrase. Please try again.';
          }
          dialog.errorAlert({ text });
        });
    };

    $scope.onSave = (secondPass) => {
      $scope.passConfirmSubmit(secondPass);
    };

    $scope.cancel = function () {
      $mdDialog.hide();
    };
  },
});
