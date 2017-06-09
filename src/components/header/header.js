import './header.less';

/**
 * The main header component
 *
 * @module app
 * @submodule header
 */
app.component('header', {
  template: require('./header.pug')(),
  controllerAs: '$ctrl',

  /**
   * The main header component constructor class
   *
   * @class header
   * @constructor
   */
  controller: class header {
    constructor($rootScope, Account) {
      this.$rootScope = $rootScope;
      this.account = Account;
    }
  },
});

