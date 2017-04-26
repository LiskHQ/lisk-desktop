import lisk from 'lisk-js';

import './main.less';

const UPDATE_INTERVAL_BALANCE = 10000;

app.component('main', {
  template: require('./main.pug')(),
  controllerAs: '$ctrl',
  controller: class main {
    constructor($scope, $rootScope, $timeout, $q, $peers, error, SendModal) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$peers = $peers;
      this.error = error;
      this.sendModal = SendModal;

      this.init();
    }

    init(attempts = 0) {
      this.$rootScope.account = {};
      this.$rootScope.prelogged = true;

      this.$peers.setActive();
      const kp = lisk.crypto.getKeys(this.$rootScope.passphrase);
      this.$rootScope.address = lisk.crypto.getAddress(kp.publicKey);

      this.update()
        .then(() => {
          this.$rootScope.prelogged = false;
          this.$rootScope.logged = true;
          this.checkIfIsDelegate();
        })
        .catch(() => {
          if (attempts < 10) {
            this.$timeout(() => this.init(attempts + 1), 1000);
          } else {
            this.error.dialog({ text: 'No peer connection' });
            this.$rootSope.logout();
          }
        });
    }

    checkIfIsDelegate() {
      if (this.$rootScope.account && this.$rootScope.account.publicKey) {
        this.$peers.active.sendRequest('delegates/get', {
          publicKey: this.$rootScope.account.publicKey,
        }, (data) => {
          this.isDelegate = data.success;
        });
      }
    }

    update() {
      this.$rootScope.reset();
      return this.$peers.active.getAccountPromise(this.$rootScope.address)
        .then((res) => {
          this.$rootScope.account.address = res.address;
          this.$rootScope.account.balance = res.balance;
          this.sendModal.init(this.$rootScope.account, this.passphrase);
        })
        .catch((res) => {
          this.$rootScope.account.balance = undefined;
          return this.$q.reject(res);
        })
        .finally(() => {
          this.$rootScope.timeout = this.$timeout(this.update.bind(this), UPDATE_INTERVAL_BALANCE);
          return this.$q.resolve();
        });
    }
  },
});
