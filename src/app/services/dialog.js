/**
 * This factory exposes methods for showing custom dialogs, alerts and teasers.
 *
 * @module app
 * @submodule dialog
 */
app.factory('dialog', ($mdDialog, $mdToast, $mdMedia) => ({

  /**
   * Uses mdDialog to show a toast with error theme
   *
   * @param {String} text - The message of the toast
   * @returns {promise} The mdDialog promise
   */
  errorToast(text) {
    return this.toast({ success: false, text });
  },

  /**
   * Uses mdDialog to show a toast with success theme
   *
   * @param {String} text - The message of the toast
   * @returns {promise} The mdDialog promise
   */
  successToast(text) {
    return this.toast({ success: true, text });
  },

  /**
   * @private
   */
  toast({ success = false, text, toastClass }) {
    toastClass = toastClass || (success ? 'lsk-toast-success' : 'lsk-toast-error');
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .toastClass(toastClass)
        .position('bottom right'),
    );
  },

  /**
   * Shows alet dialog with error theme using mdDialog
   *
   * @param {Object} config
   * @param {steing} config.title - The title of the alert box
   * @param {steing} config.test - The message of the alert box
   * @param {steing} config.button - The label of the button of the alert box
   * @returns {promise} The mdDialog promise
   */
  errorAlert({ title, text, button }) {
    return this.alert({ success: false, title, text, button });
  },

  /**
   * Shows alet dialog with success theme using mdDialog
   *
   * @param {Object} config
   * @param {steing} config.title - The title of the alert box
   * @param {steing} config.test - The message of the alert box
   * @param {steing} config.button - The label of the button of the alert box
   * @returns {promise} The mdDialog promise
   */
  successAlert({ title, text, button }) {
    return this.alert({ success: true, title, text, button });
  },

  /**
   * @private
   */
  alert({ title = '', success = false, text, button = 'OK' }) {
    title = title || (success ? 'Success' : 'Error');
    return $mdDialog.show(
      $mdDialog.alert()
        .title(title)
        .textContent(text)
        .ok(button),
    );
  },

  /**
   * A general dialog to use with any directive or component
   *
   * @param {any} options
   * @returns {promise} The mdDialog promise
   * @todo We shoudl try using this for all the other mdDialog usages the application
   */
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

