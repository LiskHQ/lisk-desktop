import './top.less';

/**
 * Contains some of the important and basic information about the account
 *
 * @module app
 * @submodule top
 */
app.component('top', {
  template: require('./top.pug')(),
  controller: class top {
    constructor(Peers, Account) {
      this.peers = Peers;
      this.account = Account;
    }
  },
});
