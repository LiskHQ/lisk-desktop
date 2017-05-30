/**
 * The main component, used as parent for transaction, forging and delgate tabs.
 *
 * @module app
 * @submodule main
 */
app.component('main', {
  template: require('./main.pug')(),
  controllerAs: '$ctrl',
  /**
   * The main component constructor class
   *
   * @class main
   * @constructor
   */
  controller: class main {
    constructor($scope, $rootScope, $timeout, $q, $state, Peers,
      dialog, SendModal, Account, AccountApi) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$q = $q;
      this.peers = Peers;
      this.dialog = dialog;
      this.transferModal = SendModal;
      this.$state = $state;
      this.account = Account;
      this.accountApi = AccountApi;

      this.activeTab = this.init();
    }

    /**
     * - Redirects to login if not logged in yet.
     * - Updates account info.
     * - Tries to find an active peer for 10 times until finds one.
     *
     * @param {Number} [attempts=0] The number of attempts to find an active peer
     * @returns {string} The name of the current state
     * @todo We're safe to remove prelogged and we can replace logged with accountApi
     */
    init(attempts = 0) {
      if (!this.account.get() || !this.account.get().passphrase) {
        // Return to login but keep the state
        this.$rootScope.landingUrl = this.$state.current.name;
        this.$state.go('login');
        return '';
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

      return this.$state.current.name;
    }

    /**
     * Uses peers service to check if the current account is a delegate
     *
     * @todo This property can be included in accountApi.get to
     *  eliminate this Api call
     */
    checkIfIsDelegate() {
      this.peers.active.sendRequest('delegates/get', {
        publicKey: this.account.get().publicKey,
      }, (data) => {
        if (data.success && data.delegate) {
          this.account.set({
            isDelegate: true,
            username: data.delegate.username,
          });
        }
      });
    }

    /**
     * Sets account credentials and balance using accountApi.get
     *
     * @returns {promise} Api call promise
     */
    update() {
      return this.accountApi.get(this.account.get().address)
        .then((res) => {
          if (res.publicKey === null) {
            // because res.publicKey is null if the account didn't send any transaction yet,
            // but we have the publicKey computed from passphrase
            delete res.publicKey;
          }

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
