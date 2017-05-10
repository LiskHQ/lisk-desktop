import lisk from 'lisk-js';

app.component('verifyMessage', {
  template: require('./verify-message.pug')(),
  controllerAs: '$ctrl',
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

