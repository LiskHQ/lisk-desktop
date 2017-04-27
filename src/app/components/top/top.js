import './top.less';

app.component('top', {
  template: require('./top.pug')(),
  bindings: {
    // account: '<',
  },
  controller: class top {
    constructor($peers, Account) {
      this.$peers = $peers;
      this.account = Account;
    }
  },
});
