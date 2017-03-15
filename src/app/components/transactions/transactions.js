
import './transactions.less';

const UPDATE_INTERVAL = 20000;

app.component('transactions', {
  template: require('./transactions.pug')(),
  bindings: {
    account: '=',
  },
  controller: class transactions {
    constructor($scope, $timeout, $q, $peers) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$peers = $peers;

      this.loaded = false;
      this.transactions = [];

      this.$scope.$watch('account', () => {
        this.reset();
        this.update();
      });

      this.$scope.$on('peerUpdate', () => {
        this.reset();
        this.update(true);
      });
    }

    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    reset() {
      this.loaded = false;
    }

    update(show, more) {
      this.loading = true;

      if (show) {
        this.loading_show = true;
      }

      this.$timeout.cancel(this.timeout);

      let limit = (this.transactions.length || 10) + (more ? 10 : 0);

      if (limit < 10) {
        limit = 10;
      }

      return this.$peers.active.getTransactions(this.account.address, limit)
        .then((res) => {
          this.transactions = res.transactions;
          this.total = res.count;

          if (this.total > this.transactions.length) {
            this.more = this.total - this.transactions.length;
          } else {
            this.more = 0;
          }
        })
        .catch(() => {
          this.transactions = [];
          this.more = 0;
        })
        .finally(() => {
          this.loaded = true;
          this.loading = false;

          if (show) {
            this.loading_show = false;
          }

          this.timeout = this.$timeout(this.update.bind(this), UPDATE_INTERVAL);
        });
    }
  },
});
