app.factory('signVerify', ($mdDialog, $mdMedia) => ({
  /**
   * Uses mdDialog to show signMessage form directive.
   *
   * @todo This should be repalced by a general dialog service
   *  which can compile any child component in the dialog
   * @returns {promise} mdDialog instance promise
   */
  openSignMessageDialog() {
    return $mdDialog.show({
      template:
          '<md-dialog flex="80">' +
            '<sign-message></sign-message>' +
          '</md-dialog>',
      fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
    });
  },

  /**
   * Uses mdDialog to show verifyMessage form directive.
   *
   * @todo This should be repalced by a general dialog service
   *  which can compile any child component in the dialog
   * @returns {promise} mdDialog instance promise
   */
  openVerifyMessageDialog() {
    return $mdDialog.show({
      template:
          '<md-dialog flex="80" >' +
            '<verify-message></verify-message>' +
          '</md-dialog>',
      fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
    });
  },
}));

