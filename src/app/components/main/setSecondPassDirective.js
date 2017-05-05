import './secondPass.less';

app.directive('setSecondPass', (setSecondPass, Account, $rootScope, dialog) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SetSecondPassLink = function (scope, element, attrs) {
    element.bind('click', () => {
      setSecondPass.show();
    });

    scope.passConfirmSubmit = (secondsecret) => {
      Account.setSecondSecret(secondsecret, attrs.publicKey, attrs.passphrase)
        .then(() => {
          dialog.successAlert('Your second passphrase was successfully registered.');
        })
        .catch((err) => {
          let text = '';
          if (err.message === 'Missing sender second signature') {
            text = 'You already have a second passphrase.';
          } else if (/^(Account does not have enough LSK)/.test(err.message)) {
            text = 'You have insuffcient funds to register a second passphrase.';
          } else {
            text = 'An error occurred while registering your second passphrase. Please try again.';
          }
          dialog.errorAlert({ text });
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
