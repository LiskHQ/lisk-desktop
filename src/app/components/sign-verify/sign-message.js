import lisk from 'lisk-js';

app.component('signMessage', {
  template: require('./sign-message.pug')(),
  bindings: {
    account: '=',
    passphrase: '=',
  },
  controller: class signMessage {
    constructor($mdDialog) {
      this.$mdDialog = $mdDialog;
    }

    sign() {
      const signnedMessage = lisk.crypto.signMessageWithSecret(this.message, this.passphrase);
      this.result = lisk.crypto.printSignedMessage(
        this.message, signnedMessage, this.account.publicKey);
    }
  },
});
