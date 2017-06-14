import './fee.less';

/**
 * The fee component
 *
 * @module app
 * @submodule fee
 */
app.component('fee', {
  template: '{{$ctrl.text}}',
  bindings: {
    fee: '<',
  },
  controller: class fee {
    constructor($scope, Account, lsk, $element) {
      this.account = Account;
      const notEnoughtLSK = lsk.normalize(this.account.get().balance) < this.fee;

      this.text = notEnoughtLSK ?
          `Not enough LSK to pay ${this.fee} LSK fee` :
          `Fee: ${this.fee} LSK`;

      if (notEnoughtLSK) {
        $element.addClass('error-message');
      }
    }
  },
});

