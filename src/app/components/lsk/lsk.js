import './lsk.less';

app.component('lsk', {
  template: require('./lsk.pug')(),
  bindings: {
    amount: '<',
  },
  controller: class lsk {
    constructor($attrs) {
      this.append = typeof $attrs.append !== 'undefined';
    }
  },
});
