import './delegateRegistration.less';

app.directive('delegateRegistration', ($mdDialog, delegateService, Account, dialog) => {
  const DelegateRegistrationLink = function ($scope, $element) {
    $scope.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          delegateService.registerDelegate(
              $scope.form.name.toLowerCase(),
              Account.get().passphrase,
              $scope.form.secondPassphrase,
            )
            .then(() => {
              dialog.successAlert({
                title: 'Congratulations!',
                text: 'Account was successfully registered as delegate.',
              })
                .then(() => {
                  Account.set({
                    isDelegate: true,
                    username: $scope.form.name.toLowerCase(),
                  });
                  $scope.reset(form);
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
          account: Account,
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
