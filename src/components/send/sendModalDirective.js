/**
 * This component triggers a modal with the send form component.
 *
 * @module app
 * @submodule showSendModal
 * @todo Replace this with a general dialog service
 */
app.directive('showSendModal', (SendModal) => {
  /**
   * Uses SendModal service to show a modal containing Send form
   *
   * @param {Object} scope - Isolated scope.
   * @param {Object} element - Angular.element instance referring directive element
   *
   */
  const ShowSendModalLink = function (scope, element) {
    element.bind('click', () => {
      if (scope.amount === undefined || scope.amount > 0) {
        SendModal.show(scope.recipientId, scope.amount);
      }
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
