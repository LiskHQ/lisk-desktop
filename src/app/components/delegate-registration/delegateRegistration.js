import './delegateRegistration.less';

app.directive('delegateRegistration', ($mdDialog, $peers, Account, success) => {
  const DelegateRegistrationLink = function ($scope, $element) {
    this.form = {
      name: '',
      fee: 25,
      error: '',
      onSubmit: (form) => {
        if (form.$valid) {
          $peers.active.registerDelegate(this.form.name.toLowerCase(), Account.get().passphrase)
            .then(() => {
              this.reset(form);

              success.dialog({ text: 'Account was successfully registered as delegate.' })
                .then(() => {
                  $mdDialog.hide();
                });
            })
            .catch((error) => {
              this.form.error = error.message ? error.message : '';
            });
        }
      },
    };

    this.reset = (form) => {
      this.form.name = '';
      this.form.error = '';

      form.$setPristine();
      form.$setUntouched();
    };

    this.cancel = (form) => {
      this.reset(form);
      $mdDialog.hide();
    };

    $element.bind('click', () => {
      $mdDialog.show({
        template: require('./delegateRegistration.pug')(),
        bindToController: true,
        locals: {
          form: this.form,
          cancel: this.cancel,
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
