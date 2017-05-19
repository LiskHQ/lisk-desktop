import './secondPass.less';

/**
 * The directive to show the second passphrase form and register it using AccountApi
 *
 * @module app
 * @submodule setSecondPass
 */
app.directive('setSecondPass', (setSecondPass, Account, $rootScope, dialog, AccountApi) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SetSecondPassLink = function (scope, element) {
    element.bind('click', () => {
      setSecondPass.show();
    });

    /**
     * We call this after second passphrase is generated.
     * Shows an alert with appropriate message in case the request fails.
     *
     * @param {String} secondSecret - The validated passphrase to register as second secret
     */
    scope.passConfirmSubmit = (secondSecret) => {
      AccountApi.setSecondSecret(secondSecret, Account.get().publicKey, Account.get().passphrase)
        .then(() => {
          dialog.successAlert({ text: 'Your second passphrase was successfully registered.' });
        })
        .catch((err) => {
          let text = '';
          if (err.message === 'Missing sender second signature') {
            text = 'You already have a second passphrase.';
          } else if (/^(Account does not have enough LSK)/.test(err.message)) {
            text = 'You have insufficient funds to register a second passphrase.';
          } else {
            text = err.message || 'An error occurred while registering your second passphrase. Please try again.';
          }
          dialog.errorAlert({ text });
        });
    };

    /**
     * @todo Why we're listening for onAfterSignup here?
     */
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
