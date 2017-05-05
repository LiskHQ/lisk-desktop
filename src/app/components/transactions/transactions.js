import './transactions.less';

const UPDATE_INTERVAL = 20000;

app.component('transactions', {
  template: require('./transactions.pug')(),
  controller: class transactions {
    constructor($scope, $rootScope, $timeout, $q, $peers, Account) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.$peers = $peers;
      this.account = Account;

      this.loaded = false;
      this.transactions = [];
      this.pendingTransactions = [];

      this.$rootScope.$on('transaction-sent', (event, transaction) => {
        this.pendingTransactions.unshift(transaction);
        this.transactions.unshift(transaction);
      });

      if (this.account.get().address) {
        this.init.call(this);
      }
      this.$rootScope.$on('onAccountChange', () => {
        this.init.call(this);
      });

      this.$scope.$on('peerUpdate', () => {
        this.init(true);
      });
    }

    init(show) {
      this.reset();
      this.update(show);
    }

    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    reset() {
      this.loaded = false;
    }
    showMore() {
      if (this.more) {
        this.update(true, true);
      }
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

      return this.account.listTransactions(this.account.get().address, limit)
        .then(this._processTransactionsResponse.bind(this))
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

    _processTransactionsResponse(response) {
      this.pendingTransactions = this.pendingTransactions.filter(
        pt => response.transactions.filter(t => t.id === pt.id).length === 0);
      this.transactions = this.pendingTransactions.concat(response.transactions);
      this.total = response.count;

      if (this.total > this.transactions.length) {
        this.more = this.total - this.transactions.length;
      } else {
        this.more = 0;
      }
    }
  },
});
