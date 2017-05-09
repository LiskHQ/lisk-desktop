import './login.less';
import './save.less';

app.component('login', {
  template: require('./login.pug')(),
  controller: class login {

    /* eslint no-param-reassign: ["error", { "props": false }] */

    constructor($scope, $rootScope, $timeout, $document, $mdMedia,
      $cookies, $location, Passphrase, $state, Account) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$document = $document;
      this.$mdMedia = $mdMedia;
      this.$cookies = $cookies;
      this.$location = $location;
      this.$state = $state;
      this.account = Account;

      this.Passphrase = Passphrase;
      this.generatingNewPassphrase = false;

      this.networks = [{
        name: 'Mainnet',
      }, {
        name: 'Testnet',
        testnet: true,
      }, {
        name: 'Custom Node',
        custom: true,
        address: 'http://localhost:8000',
      }];
      this.network = this.networks[0];

      this.$scope.$watch('$ctrl.input_passphrase', val => this.valid = this.Passphrase.isValidPassphrase(val));
      this.$timeout(this.devTestAccount.bind(this), 200);

      this.$scope.$watch(() => this.$mdMedia('xs') || this.$mdMedia('sm'), (wantsFullScreen) => {
        this.$scope.customFullscreen = wantsFullScreen === true;
      });

      this.$scope.$on('onAfterSignup', (ev, args) => {
        if (args.target === 'primary-pass') {
          this.passConfirmSubmit(args.passphrase);
        }
      });
    }

    passConfirmSubmit(_passphrase = this.input_passphrase) {
      if (this.Passphrase.normalize.constructor === Function) {
        this.account.set({
          passphrase: this.Passphrase.normalize(_passphrase),
          network: this.network,
        });
        this.$state.go(this.$rootScope.landingUrl || 'main.transactions');
      }
    }

    generatePassphrase() {
      this.generatingNewPassphrase = true;
    }

    devTestAccount() {
      const peerStack = this.$location.search().peerStack || this.$cookies.get('peerStack');
      if (peerStack === 'localhost') {
        this.network = this.networks[2];
        angular.merge(this.network, {
          address: 'http://localhost:4000',
          testnet: true,
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        });
      } else if (peerStack === 'testnet') {
        this.network = this.networks[1];
      }
      const passphrase = this.$location.search().passphrase || this.$cookies.get('passphrase');
      if (passphrase) {
        this.input_passphrase = passphrase;
      }
    }
  },
});
