import './passphrase.less';

app.directive('passphrase', ($rootScope, $document, Passphrase, dialog) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const PassphraseLink = function (scope, element, attrs) {
    const bindEvents = (listener) => {
      $document.bind('mousemove', listener);
    };

    const unbindEvents = (listener) => {
      $document.unbind('mousemove', listener);
    };

    scope.$on('$destroy', () => {
      unbindEvents();
    });

    /**
     * Uses passphrase.generatePassPhrase to generate passphrase from a given seed
     * Randomly asks for one of the words in passphrase to ensure it's noted down
     *
     * @param {string[]} seed - The array of 16 hex numbers in string format
     * @todo Why we're broadcasting onAfterSignup here?
     *  Isn't this only related to login component?
     */
    const generateAndDoubleCheck = (seed) => {
      const passphrase = Passphrase.generatePassPhrase(seed);

      dialog.modal('save-passphrase', {
        passphrase,
        label: attrs.label,
        fee: attrs.fee,
        'on-save': scope.onSave,
      });
    };

    const terminate = (seed) => {
      unbindEvents(Passphrase.listene);
      generateAndDoubleCheck(seed);
    };

    scope.simulateMousemove = () => {
      $document.mousemove();
    };

    /**
     * Tests useragent with a regexp and defines if the account is mobile device
     *
     * @param {String} [agent] - The useragent string, This parameter is used for
     *  unit testing purpose
     * @returns {Boolean} - whether the agent represents a mobile device or not
     */
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
    link: PassphraseLink,
    restrict: 'E',
    scope: {
      onSave: '=',
    },
    template: require('./passphrase.pug')(),
  };
});
