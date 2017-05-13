import './header.less';

app.component('header', {
  template: require('./header.pug')(),
  controllerAs: '$ctrl',
  controller: class header {
    constructor($rootScope, Account, signVerify) {
      this.$rootScope = $rootScope;
      this.account = Account;
      this.signVerify = signVerify;
    }
  },
});

