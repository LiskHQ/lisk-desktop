/**
 * @description This factory provides methods to call Notification
 *
 * @module app
 * @submodule Notify
 */
app.factory('Notify', ($window, lsk) => {
  /**
   * The Notify factory constructor class
   * @class Notify
   * @constructor
   */
  class Notify {
    constructor() {
      this.isFocused = true;
    }

    /**
     * Initialize event listeners
     *
     * @returns {this}
     * @method init
     * @memberof Notify
     */
    init() {
      const { electron } = $window;
      if (electron) {
        electron.ipcRenderer.on('blur', () => this.isFocused = false);
        electron.ipcRenderer.on('focus', () => this.isFocused = true);
      }
      return this;
    }

    /**
     * Routing to specific Notification creator based on type param
     * @param {string} type
     * @param {any} data
     *
     * @method about
     * @public
     * @memberof Notify
     */
    about(type, data) {
      if (this.isFocused) return;
      switch (type) {
        case 'deposite':
          this.__deposite(data);
          break;
        default: break;
      }
    }

    /**
     * Creating notification about deposit
     *
     * @param {number} amount
     * @private
     * @memberof Notify
     */
    __deposite(amount) { // eslint-disable-line
      if (amount > 0) {
        new $window.Notification( // eslint-disable-line
          'LSK received',
          {
            body: `You've received ${lsk.normalize(amount)} LSK.`,
          },
        );
      }
    }
  }

  return new Notify();
});
