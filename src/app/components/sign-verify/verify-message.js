import lisk from 'lisk-js';

app.component('verifyMessage', {
  template: require('./verify-message.pug')(),
  controller: class verifyMessage {
    constructor($mdDialog) {
      this.$mdDialog = $mdDialog;

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
      } catch (e) {
        if (e.message === "Cannot read property 'length' of null" && this.signature.value) {
          this.signature.error.invalid = true;
        } else if (e.message.substring(0, 4) === 'nacl' && this.publicKey.value) {
          this.publicKey.error.invalid = true;
        }
      }
    }
  },
});

