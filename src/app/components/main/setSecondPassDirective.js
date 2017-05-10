import './secondPass.less';

app.directive('setSecondPass', (setSecondPass, Account, $rootScope, dialog, AccountApi) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SetSecondPassLink = function (scope, element) {
    element.bind('click', () => {
      setSecondPass.show();
    });

    scope.passConfirmSubmit = (secondsecret) => {
      AccountApi.setSecondSecret(secondsecret, Account.get().publicKey, Account.get().passphrase)
        .then(() => {
          dialog.successAlert({ text: 'Your second passphrase was successfully registered.' });
        })
        .catch((err) => {
          let text = '';
          if (err.message === 'Missing sender second signature') {
            text = 'You already have a second passphrase.';
          } else if (/^(Account does not have enough LSK)/.test(err.message)) {
            text = 'You have insuffcient funds to register a second passphrase.';
          } else {
            text = err.message || 'An error occurred while registering your second passphrase. Please try again.';
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
