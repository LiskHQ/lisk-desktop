app.factory('signVerify', ($mdDialog, $mdMedia) => ({
  openSignMessageDialog(_account, _passphrase) {
    return $mdDialog.show({
      controllerAs: '$ctrl',
      controller: class signMessageDialog {
        constructor($scope, account, passphrase) {
          this.$scope = $scope;
          this.$scope.account = account;
          this.$scope.passphrase = passphrase;
        }
        },
      template:
          '<md-dialog flex="80" >' +
            '<sign-message account="account" passphrase="passphrase">' +
            '</sign-message>' +
          '</md-dialog>',
      fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
      locals: {
        account: _account,
        passphrase: _passphrase,
      },
    });
  },

  openVerifyMessageDialog() {
    return $mdDialog.show({
      template:
          '<md-dialog flex="80" >' +
            '<verify-message account="account" passphrase="passphrase">' +
            '</verify-message>' +
          '</md-dialog>',
      fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
    });
  },
}));

