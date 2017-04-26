import './secondPass.less';

app.directive('setSecondPass', (setSecondPass, $peers, $rootScope, success, error) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SetSecondPassLink = function (scope, element, attrs) {
    element.bind('click', () => {
      setSecondPass.show();
    });

    scope.passConfirmSubmit = (secondsecret) => {
      $peers.active.setSignature(secondsecret, attrs.publicKey, attrs.passphrase)
        .then(() => {
          success.dialog('Your second passphrase is successfully registered.');
        })
        .catch((err) => {
          if (err.message === 'Missing sender second signature') {
            error.dialog({ text: 'You already have a second passphrase.' });
          } else if (/^(Account does not have enough LSK)/.test(err.message)) {
            error.dialog({ text: 'You don\'t have enought credit to register second passphrase.' });
          } else {
            error.dialog({ text: 'An error happended registering your second passphrase. Please try later.' });
          }
        });
    };

    scope.$on('onAfterSignup', (ev, args) => {
      if (args.target === 'second-pass') {
        scope.passConfirmSubmit(args.passphrase);
      }
    });
  };
  return {
    restrict: 'A',
    link: SetSecondPassLink,
  };
});
