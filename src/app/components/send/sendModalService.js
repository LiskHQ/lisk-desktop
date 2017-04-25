app.factory('SendModal', ($mdDialog) => {
  let account = null;
  let passphrase = null;

  const init = (_account, _passphrase) => {
    account = _account;
    passphrase = _passphrase;
  };

  const hide = () => {
  };

  const show = (recipientId, amount) => ($mdDialog.show({
    template: '<send account="ms.account" passphrase="ms.passphrase" recipient-id="ms.recipientId" transfer-amount="ms.amount"></send>',
    parent: angular.element('#main'),
    locals: {
      account, passphrase, recipientId, amount,
    },
    bindToController: true,
    controller: ['$scope', ($scope) => {
      $scope.account = account;
      $scope.recipientId = recipientId;
      $scope.passphrase = passphrase;
      $scope.amount = amount;
    }],
    controllerAs: 'ms',
  }));

  return {
    hide, show, init,
  };
});
