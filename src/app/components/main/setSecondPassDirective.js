import './secondPass.less';

app.directive('setSecondPass', (setSecondPass) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */
  const SetSecondPassLink = function (scope, element) {
    element.bind('click', () => {
      setSecondPass.show();
    });

    scope.passConfirmSubmit = (passphrase) => {
      console.log('second pass', passphrase);
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
