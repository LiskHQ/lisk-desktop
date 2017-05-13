import './top.less';

app.component('top', {
  template: require('./top.pug')(),
  controller: class top {
    constructor(Peers, Account) {
      this.peers = Peers;
      this.account = Account;
    }
  },
});
