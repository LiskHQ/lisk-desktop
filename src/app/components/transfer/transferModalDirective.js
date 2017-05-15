app.directive('showTransferModal', (TransferModal) => {
  /**
   * 
   * Uses TransferModal service to show a modal containg Transfer form
   * @param {object} scope - Isolated scope.
   * @param {object} element - Angular.element instance refering directive element
   * 
   */
  const ShowTransferModalLink = function (scope, element) {
    element.bind('click', () => {
      TransferModal.show(scope.recipientId, scope.amount);
    });
  };

  return {
    restrict: 'A',
    scope: {
      recipientId: '<',
      amount: '<',
    },
    link: ShowTransferModalLink,
  };
});
