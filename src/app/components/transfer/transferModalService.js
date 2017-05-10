app.factory('TransferModal', ($mdDialog) => {
  const init = () => {
  };

  const hide = () => {
  };

  const show = (recipientId, amount) => ($mdDialog.show({
    template: '<md-dialog flex="80" ><transfer recipient-id="ms.recipientId" transfer-amount="ms.amount"></transfer></md-dialog>',
    locals: {
      recipientId, amount,
    },
    bindToController: true,
    controller: ['$scope', ($scope) => {
      $scope.recipientId = recipientId;
      $scope.amount = amount;
    }],
    controllerAs: 'ms',
  }));

  return {
    hide, show, init,
  };
});
