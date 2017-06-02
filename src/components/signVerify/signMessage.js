import lisk from 'lisk-js';
import './signVerifyMessage.less';

/**
 * This component contains the form for signing a message
 *
 * @module app
 * @submodule signMessage
 */
app.component('signMessage', {
  template: require('./signMessage.pug')(),
  /**
   * The signMessage component constructor class
   *
   * @class signMessage
   * @constructor
   */
  controller: class signMessage {
    constructor($mdDialog, Account, dialog) {
      this.$mdDialog = $mdDialog;
      this.account = Account;
      this.dialog = dialog;
    }

    /**
     * Uses lisk.crypto and signs the value assigned to this.message
     * The result will be available on this.result
     *
     * @method sign
     */
    sign() {
      const signnedMessage = lisk.crypto.signMessageWithSecret(this.message,
        this.account.get().passphrase);
      this.result = lisk.crypto.printSignedMessage(
        this.message, signnedMessage, this.account.get().publicKey);
      this.resultIsShown = false;
    }

    showResult() {
      if (this.result) {
        this.resultIsShown = true;
      }
    }
  },
});
