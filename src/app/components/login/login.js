import './login.less';
import './save.less';

app.component('login', {
  template: require('./login.pug')(),
  controller: class login {

    /* eslint no-param-reassign: ["error", { "props": false }] */

    constructor($scope, $rootScope, $timeout, $document, $mdMedia,
      $cookies, $peers, Passphrase, $state, Account) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$document = $document;
      this.$mdMedia = $mdMedia;
      this.$cookies = $cookies;
      this.$peers = $peers;
      this.$state = $state;
      this.account = Account;

      this.Passphrase = Passphrase;
      this.generatingNewPassphrase = false;

      this.$scope.$watch('$ctrl.input_passphrase', val => this.valid = this.Passphrase.isValidPassphrase(val));
      this.$timeout(this.devTestAccount.bind(this), 200);

      this.$scope.$watch(() => this.$mdMedia('xs') || this.$mdMedia('sm'), (wantsFullScreen) => {
        this.$scope.customFullscreen = wantsFullScreen === true;
      });
      this.$scope.$watch('$ctrl.$peers.currentPeerConfig', () => {
        this.$peers.setActive(this.$peers.currentPeerConfig);
      });
      this.$scope.$watch('$ctrl.$peers.stack', (val) => {
        if (val && !this.$peers.currentPeerConfig.node) {
          this.$peers.setActive($peers.stack.official[0]);
        }
      });

      this.$scope.$on('onAfterSignup', (ev, args) => {
        if (args.target === 'primary-pass') {
          this.passConfirmSubmit(args.passphrase);
        }
      });
    }

    passConfirmSubmit(_passphrase = this.input_passphrase) {
      if (this.Passphrase.normalize.constructor === Function) {
        this.account.set({ passphrase: this.Passphrase.normalize(_passphrase) });

        this.$state.go('main');
      }
    }

    generatePassphrase() {
      this.generatingNewPassphrase = true;
    }

    devTestAccount() {
      const passphrase = this.$cookies.get('passphrase');
      if (passphrase) {
        this.input_passphrase = passphrase;
        // this.$timeout(this.passConfirmSubmit.bind(this), 10);
      }
    }
  },
});
