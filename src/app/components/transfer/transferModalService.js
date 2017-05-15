app.factory('TransferModal', ($mdDialog) => {
  /**
   * Hides the existing modal, destroying the initiated controller and related scope
   * @todo show be possible to cancel dialogs by their Id
   */
  const hide = () => {
    $mdDialog.cancel();
  };

  /**
   *
   * Uses ndModal to along with transfer form directive to show a modal.
   * @param {string} recipientId -The address or the wallet ID of recipient
   * @param {number} amount - The amount value in LSK
   * 
   * @todo This must be replced by a genersl service with the possibility to
   *       be used with any child directive.
   */
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
