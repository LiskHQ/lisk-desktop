app.directive('showSendModal', (SendModal) => {
  const ShowSendModalLink = function (scope, element) {
    element.bind('click', () => {
      SendModal.show(scope.recipientId, scope.amount);
    });
  };

  return {
    restrict: 'A',
    scope: {
      recipientId: '<',
      amount: '<',
    },
    link: ShowSendModalLink,
  };
});
