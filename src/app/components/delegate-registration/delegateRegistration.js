import './delegateRegistration.less';

app.directive('delegateRegistration', ($mdDialog, $peers, Account, success) => {
  const DelegateRegistrationLink = function ($scope, $element) {
    $scope.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          $peers.active.registerDelegate($scope.form.name.toLowerCase(), Account.get().passphrase)
            .then(() => {
              $scope.reset(form);

              success.dialog({ text: 'Account was successfully registered as delegate.' })
                .then(() => {
                  $mdDialog.hide();
                });
            })
            .catch((error) => {
              $scope.form.error = error.message ? error.message : '';
            });
        }
      },
    };

    $scope.reset = (form) => {
      $scope.form.name = '';
      $scope.form.error = '';

      form.$setPristine();
      form.$setUntouched();
    };

    $scope.cancel = (form) => {
      $scope.reset(form);
      $mdDialog.hide();
    };

    $element.bind('click', () => {
      $mdDialog.show({
        template: require('./delegateRegistration.pug')(),
        bindToController: true,
        locals: {
          form: $scope.form,
          cancel: $scope.cancel,
        },
        controller: () => {},
        controllerAs: '$ctrl',
      });
    });
  };

  return {
    restrict: 'A',
    link: DelegateRegistrationLink,
  };
});
