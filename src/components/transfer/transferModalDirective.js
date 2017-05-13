app.directive('showTransferModal', (TransferModal) => {
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
