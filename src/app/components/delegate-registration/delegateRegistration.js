import './delegateRegistration.less';

/**
 * @description The directive performing as the form to register the client as delegate
 *
 * @class app.delegateRegistration
 * @memberOf app
 */
app.directive('delegateRegistration', ($mdDialog, delegateService, Account, dialog, $rootScope) => {
  const DelegateRegistrationLink = function ($scope, $element) {
    function checkPendingRegistration() {
      delegateService.getDelegate({
        username: $scope.username,
      }).then((data) => {
        Account.set({
          isDelegate: true,
          username: data.delegate.username,
        });
        $scope.pendingRegistrationListener();
      });
    }

    $scope.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          $scope.username = $scope.form.name.toLowerCase();
          delegateService.registerDelegate(
              $scope.username,
              Account.get().passphrase,
              $scope.form.secondPassphrase,
            )
            .then(() => {
              dialog.successAlert({
                title: 'Success',
                text: 'Delegate registration was successfully submitted. It can take several seconds before it is confirmed.',
              })
                .then(() => {
                  $scope.pendingRegistrationListener = $rootScope.$on('syncTick', () => {
                    checkPendingRegistration();
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
