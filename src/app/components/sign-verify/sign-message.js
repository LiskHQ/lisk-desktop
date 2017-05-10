import lisk from 'lisk-js';

app.component('signMessage', {
  template: require('./sign-message.pug')(),
  controller: class signMessage {
    constructor($mdDialog, Account) {
      this.$mdDialog = $mdDialog;
      this.account = Account;
    }

    sign() {
      const signnedMessage = lisk.crypto.signMessageWithSecret(this.message,
        this.account.get().passphrase);
      this.result = lisk.crypto.printSignedMessage(
        this.message, signnedMessage, this.account.get().publicKey);
    }
  },
});
