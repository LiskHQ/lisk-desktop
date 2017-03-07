
import './top.less';

app.component('top', {
  template: require('./top.pug')(),
  bindings: {
    account: '<',
  },
  controller: class top {
    constructor($peers) {
      this.$peers = $peers;
    }
  },
});
