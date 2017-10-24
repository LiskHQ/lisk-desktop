import i18next from 'i18next';
import { fromRawLsk } from './lsk';
/**
 * The Notify factory constructor class
 * @class Notify
 * @constructor
 */
class Notification {
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
    const { ipc } = window;
    if (ipc) {
      ipc.on('blur', () => { this.isFocused = false; });
      ipc.on('focus', () => { this.isFocused = true; });
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
      case 'deposit':
        this._deposit(data);
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
  _deposit(amount) { // eslint-disable-line
    const body = i18next.t('You\'ve received {{value}} LSK.', { value: fromRawLsk(amount) });
    new window.Notification(i18next.t('LSK received'), { body }); // eslint-disable-line
  }
}

export default new Notification();

