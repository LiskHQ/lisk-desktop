app.factory('dialog', ($mdDialog, $mdToast, $mdMedia) => ({

  errorToast(text) {
    return this.toast({ success: false, text });
  },

  successToast(text) {
    return this.toast({ success: true, text });
  },

  toast({ success = false, text, toastClass }) {
    toastClass = toastClass || (success ? 'lsk-toast-success' : 'lsk-toast-error');
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .toastClass(toastClass)
        .position('bottom right'),
    );
  },

  errorAlert({ title, text, button }) {
    return this.alert({ success: false, title, text, button });
  },

  successAlert({ title, text, button }) {
    return this.alert({ success: true, title, text, button });
  },

  alert({ title = '', success = false, text, button = 'OK' }) {
    title = title || (success ? 'Success' : 'Error');
    return $mdDialog.show(
      $mdDialog.alert()
        .title(title)
        .textContent(text)
        .ok(button),
    );
  },

  modal(options) {
    options.fullscreen = ($mdMedia('sm') || $mdMedia('xs'));
    if (options.template) {
      options.template =
          `<md-dialog flex="80" >${
            options.template
          }</md-dialog>`;
    }
    return $mdDialog.show(options);
  },
}));

