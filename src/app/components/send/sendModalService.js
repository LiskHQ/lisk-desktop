app.factory('SendModal', ($mdDialog) => {
  const init = () => {
  };

  const hide = () => {
  };

  const show = (recipientId, amount) => ($mdDialog.show({
    template: '<md-dialog flex="80" ><send recipient-id="ms.recipientId" transfer-amount="ms.amount"></send></md-dialog>',
    parent: angular.element('#main'),
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
