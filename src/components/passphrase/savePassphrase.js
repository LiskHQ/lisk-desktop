import './savePassphrase.less';

app.component('savePassphrase', {
  template: require('./savePassphrase.pug')(),
  bindings: {
    passphrase: '<',
  },
  controller: class savePassphrase {
    constructor($scope, $rootScope, $mdDialog) {
      this.$mdDialog = $mdDialog;
      this.$rootScope = $rootScope;

      $scope.$watch('$ctrl.missing_input', () => {
        this.missing_ok = this.missing_input && this.missing_input === this.missing_word;
      });
    }

    next() {
      this.enter = true;

      const words = this.passphrase.split(' ');
      const missingNumber = parseInt(Math.random() * words.length, 10);

      this.missing_word = words[missingNumber];
      this.pre = words.slice(0, missingNumber).join(' ');
      this.pos = words.slice(missingNumber + 1).join(' ');
    }

    ok() {
      this.$mdDialog.hide();
    }

    close() {
      this.$mdDialog.cancel();
      this.$rootScope.$broadcast('onSignupCancel');
    }
  },
});

