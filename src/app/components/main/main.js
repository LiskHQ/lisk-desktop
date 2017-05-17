import './main.less';

app.component('main', {
  template: require('./main.pug')(),
  controllerAs: '$ctrl',
  controller: class main {
    constructor($scope, $rootScope, $timeout, $q, $state, Peers,
      dialog, TransferModal, Account, AccountApi) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.peers = Peers;
      this.dialog = dialog;
      this.transferModal = TransferModal;
      this.$state = $state;
      this.account = Account;
      this.accountApi = AccountApi;

      this.init();
    }

    init(attempts = 0) {
      if (!this.account.get() || !this.account.get().passphrase) {
        // Return to login but keep the state
        this.$rootScope.landingUrl = this.$state.current.name;
        this.$state.go('login');
        return;
      }

      this.$rootScope.prelogged = true;

      this.update(attempts)
        .then(() => {
          this.$rootScope.prelogged = false;
          this.$rootScope.logged = true;
          if (this.$timeout) {
            clearTimeout(this.$timeout);
            delete this.$timeout;
          }

          if (this.account.get() && this.account.get().publicKey) {
            this.checkIfIsDelegate();
            this.$scope.$on('syncTick', this.update.bind(this));
          }
        })
        .catch(() => {
          if (attempts < 10) {
            this.$timeout(() => this.update(attempts + 1), 1000);
          } else {
            this.dialog.errorAlert({ text: 'No peer connection' });
            this.$rootScope.logout();
          }
        });

      this.activeTab = this.$state.current.name;
    }

    checkIfIsDelegate() {
      this.peers.active.sendRequest('delegates/get', {
        publicKey: this.account.get().publicKey,
      }, (data) => {
        if (data.success && data.delegate) {
          this.account.set({
            isDelegate: true,
            username: data.delegate.username,
          });
          if (this.$rootScope.landingUrl === 'main.forging') {
            this.$state.go(this.$rootScope.landingUrl);
          }
        }
      });
    }

    update() {
      return this.accountApi.get(this.account.get().address)
        .then((res) => {
          this.account.set(res);
        })
        .catch((res) => {
          this.account.set({ balance: null });
          return this.$q.reject(res);
        })
        .finally(() => this.$q.resolve());
    }
  },
});
