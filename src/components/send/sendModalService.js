/**
 * This component shows a modal with the send form component.
 *
 * @module app
 * @submodule SendModal
 * @todo Replace this with a general dialog service
 */
app.factory('SendModal', ($mdDialog) => {
  const init = () => {
  };
  /**
   * Hides the existing modal, destroying the initiated controller and related scope
   * @todo should be possible to cancel dialogs by their Id
   */
  const hide = () => {
    $mdDialog.cancel();
  };

  /**
   *
   * Uses ndModal to along with send form directive to show a modal.
   * @param {String} recipientId -The address or the wallet ID of recipient
   * @param {Number} amount - The amount value in LSK
   *
   * @todo This must be replaced by a general service with the possibility to
   *       be used with any child directive.
   */
  const show = (recipientId, amount) => ($mdDialog.show({
    template: '<md-dialog flex="80" ><send recipient-id="ms.recipientId" send-amount="ms.amount"></send></md-dialog>',
    locals: {
      recipientId, amount,
    },
    bindToController: true,
    controller: ['$scope', ($scope) => {
      $scope.recipientId = recipientId;
      $scope.sendAmount = amount;
    }],
    controllerAs: 'ms',
  }));

  return {
    hide, show, init,
  };
});
