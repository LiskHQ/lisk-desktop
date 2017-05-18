import './delegateRegistration.less';

/**
 * @description The directive performing as the form to register the client as delegate
 * 
 * @class app.delegateRegistration
 * @memberOf app
 */
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
                title: 'Success',
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

    /**
     * Resets the from fields and form state.
     * 
     * @method reset
     * @param {Object} from - The form event object. containing form elements and erros list.
     */
    $scope.reset = (form) => {
      $scope.form.name = '';
      $scope.form.error = '';

      form.$setPristine();
      form.$setUntouched();
    };

    /**
     * hides the dialog and resets form.
     * 
     * @method cancel
     * @param {Object} from - The form event object. containing form elements and erros list.
     */
    $scope.cancel = (form) => {
      $scope.reset(form);
      $mdDialog.hide();
    };

    /**
     * Shows from dialog.
     * 
     * @todo This should be replaced by a generaldialog directive.
     */
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
