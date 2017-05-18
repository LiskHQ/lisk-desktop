import lisk from 'lisk-js';

/**
 * This component contains the form for signing a message
 *
 * @module app
 * @submodule signMessage
 */
app.component('signMessage', {
  template: require('./sign-message.pug')(),
  /**
   * The signMessage component constructor class
   *
   * @class signMessage
   * @constructor
   */
  controller: class signMessage {
    constructor($mdDialog, Account) {
      this.$mdDialog = $mdDialog;
      this.account = Account;
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
    }
  },
});
