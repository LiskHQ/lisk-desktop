/**
 * This factory exposes methods for showing custom dialogs, alerts and teasers.
 *
 * @module app
 * @submodule dialog
 */
app.factory('dialog', ($mdDialog, $mdToast) => ({

  /**
   * Uses mdToast to show a toast with error theme
   *
   * @param {String} text - The message of the toast
   * @returns {promise} The mdToast promise
   */
  errorToast(text) {
    return this.toast({ success: false, text });
  },

  /**
   * Uses mdToast to show a toast with success theme
   *
   * @param {String} text - The message of the toast
   * @returns {promise} The mdToast promise
   */
  successToast(text) {
    return this.toast({ success: true, text });
  },

  /**
   * Uses mdToast to show a toast with possibility
   * to define custom theme using toastClass and success
   *
   * @param {Object} config
   * @param {Boolean} config.success - Defines if the toast is shown with
   *  success or error theme
   * @param {string} config.text - The message of the toast
   * @param {string} config.toastClass - The class name(s) to be assigned to
   *  toast outermost tag
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
   * Shows alert dialog with error theme using mdDialog
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
   * Shows alert dialog with success theme using mdDialog
   *
   * @param {Object} config
   * @param {string} config.title - The title of the alert box
   * @param {string} config.test - The message of the alert box
   * @param {string} config.button - The label of the button of the alert box
   * @returns {promise} The mdDialog promise
   */
  successAlert({ title, text, button }) {
    return this.alert({ success: true, title, text, button });
  },

  /**
   * Shows custom alert modal using mdDialog
   *
   * @param {Object} config
   * @param {string} [config.title = ''] - The title of the alert
   * @param {Boolean} [config.success = false] - Defines the theme of the alert
   * @param {string} config.text - The main message of the alert
   * @param {string} [config.button = 'OK'] - The label of the confirmation button
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
   * @param {string} component - name of the component that we want to open it inside a dialog
   * @param {object} options
   */
  modal(component, options) {
    function modalController($scope) {
      $scope.closeDialog = function () {
        $mdDialog.hide();
      };
    }
    let attrs = '';
    if (options) {
      Object.keys(options).forEach((item) => {
        attrs += `data-${item}="${options[item]}" `;
      });
    }
    $mdDialog.show({
      parent: angular.element(document.body),
      template: `
                <md-dialog flex="80" >
                    <${component} ${attrs} close-dialog="closeDialog()" ></${component}>
                </md-dialog>
              `,
      controller: modalController,
    });
  },
}));
