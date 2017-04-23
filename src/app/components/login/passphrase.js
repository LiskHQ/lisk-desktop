import './passphrase.less';

app.directive('passphrase', ($rootScope, $document, Passphrase, $mdDialog, $mdMedia, $timeout) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SignupLink = function (scope, element, attrs) {
    const bindEvents = (listener) => {
      $document.bind('mousemove', listener);
    };

    const unbindEvents = (listener) => {
      $document.unbind('mousemove', listener);
    };

    const generateAndDoubleCheck = (seed) => {
      const passphrase = Passphrase.generatePassPhrase(seed);

      const ok = () => {
        // this.input_passphrase = passphrase;
        $timeout(() => {
          $rootScope.$broadcast('onAfterSignup', {
            passphrase,
            target: attrs.target,
          });
        }, 100);
      };

      $mdDialog.show({
        controllerAs: '$ctrl',
        controller: /* @ngInject*/ class save {
          constructor($scope) {
            this.$mdDialog = $mdDialog;
            this.passphrase = passphrase;

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
            ok();
            this.close();
          }

          close() {
            this.$mdDialog.hide();
          }
        },

        template: require('./save.pug')(),
        fullscreen: ($mdMedia('sm') || $mdMedia('xs')) && this.scope.customFullscreen,
      });
    };

    const terminate = (seed) => {
      unbindEvents(Passphrase.listene);
      generateAndDoubleCheck(seed);
    };

    scope.simulateMousemove = () => {
      $document.mousemove();
    };

    scope.mobileAndTabletcheck = (agent) => {
      let check = false;
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent || navigator.userAgent || navigator.vendor || window.opera)) {
        check = true;
      }
      return check;
    };

    Passphrase.init();
    bindEvents(e => Passphrase.listener(e, terminate));
    scope.progress = Passphrase.progress;
  };

  return {
    link: SignupLink,
    restrict: 'E',
    scope: {
      onLogin: '=',
    },
    controller: () => {},
    template: require('./passphrase.pug')(),
  };
});
