app.factory('signVerify', ($mdDialog, $mdMedia) => ({
  openSignMessageDialog() {
    return $mdDialog.show({
      template:
          '<md-dialog flex="80">' +
            '<sign-message></sign-message>' +
          '</md-dialog>',
      fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
    });
  },

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

