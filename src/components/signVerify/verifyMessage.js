import lisk from 'lisk-js';
import './signVerifyMessage.less';

/**
 * This component contains the form for verifying a signed message
 *
 * @module app
 * @submodule signMessage
 */
app.component('verifyMessage', {
  template: require('./verifyMessage.pug')(),
  controllerAs: '$ctrl',
  /**
   * The verifyMessage component constructor class
   *
   * @class verifyMessage
   * @constructor
   */
  controller: class verifyMessage {
    constructor($mdDialog, Account) {
      this.$mdDialog = $mdDialog;
      this.account = Account;

      this.publicKey = {
        error: {
        },
        value: '',
      };
      this.signature = {
        error: {
        },
        value: '',
      };
    }

    /**
     * Uses lisk.crypto and verifies a signed message
     *
     * @method verify
     */
    verify() {
      this.publicKey.error = {};
      this.signature.error = {};
      this.result = '';
      try {
        this.result = lisk.crypto.verifyMessageWithPublicKey(
          this.signature.value, this.publicKey.value);
        if (this.result && this.result.message) {
          throw this.result;
        }
      } catch (e) {
        if (e.message.indexOf('Invalid publicKey') !== -1 && this.publicKey.value) {
          this.publicKey.error.invalid = true;
        } else if (e.message.indexOf('Invalid signature') !== -1 && this.signature.value) {
          this.signature.error.invalid = true;
        }
        this.result = '';
      }
    }
  },
});

