import './transfer.less';

const ADDRESS_VALID_RE = '^[0-9]{1,21}[L|l]$';
const AMOUNT_VALID_RE = '^[0-9]+(.[0-9]{1,8})?$';

app.component('transfer', {
  template: require('./transfer.pug')(),
  bindings: {
    recipientId: '<',
    transferAmount: '<',
  },
  controller: class transfer {
    constructor($scope, lsk, dialog, $mdDialog, $q, $rootScope, Account, AccountApi) {
      this.$scope = $scope;
      this.dialog = dialog;
      this.$mdDialog = $mdDialog;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.account = Account;
      this.accountApi = AccountApi;

      this.recipient = {
        regexp: ADDRESS_VALID_RE,
        value: $scope.$ctrl.recipientId,
      };

      this.amount = {
        regexp: AMOUNT_VALID_RE,
      };
      if ($scope.$ctrl.transferAmount) {
        this.amount.value = parseInt(lsk.normalize($scope.$ctrl.transferAmount), 10);
      }

      this.$scope.$watch('$ctrl.amount.value', () => {
        if (lsk.from(this.amount.value) !== this.amount.raw) {
          this.amount.raw = lsk.from(this.amount.value) || 0;
        }
      });

      this.$scope.$watch('$ctrl.account.balance', () => {
        this.amount.max = lsk.normalize(this.account.get().balance - 10000000);
      });

      this.$scope.$watch('$ctrl.amount.value', () => {
        if (this.amount.value) {
          this.transferForm.amount.$setValidity('max', parseFloat(this.amount.value) <= parseFloat(this.amount.max));
        }
      });
    }

    reset() {
      this.recipient.value = '';
      this.amount.value = '';
    }

    transfer() {
      this.loading = true;

      this.accountApi.transactions.create(
        this.recipient.value,
        this.amount.raw,
        this.account.get().passphrase,
        this.secondPassphrase || null,
      ).then((data) => {
        const transaction = {
          id: data.transactionId,
          senderPublicKey: this.account.get().publicKey,
          senderId: this.account.get().address,
          recipientId: this.recipient.value,
          amount: this.amount.raw,
          fee: 10000000,
        };
        this.$rootScope.$broadcast('transaction-sent', transaction);
        return this.dialog.successAlert({ text: `${this.amount.value} LSK was successfully transferred to ${this.recipient.value}` })
            .then(() => {
              this.reset();
            });
      }).catch((res) => {
        this.dialog.errorAlert({ text: res && res.message ? res.message : 'An error occurred while creating the transaction.' });
      }).finally(() => {
        this.loading = false;
      });
    }

    setMaxAmount() {
      this.amount.value = Math.max(0, this.amount.max);
    }

    cancel() {
      this.$mdDialog.cancel();
    }
  },
});
