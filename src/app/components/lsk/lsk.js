import './lsk.less';

/**
 * The lsk component showing the amount and unit of the transaction
 * This component adds the unit and it just needs the raw amount
 *
 * @module app
 * @submodule lsk
 */
app.component('lsk', {
  template: require('./lsk.pug')(),
  bindings: {
    amount: '<',
  },
  /**
   * The lsk component constructor class
   *
   * @class lsk
   * @constructor
   */
  controller: class lsk {
    constructor($attrs) {
      this.append = typeof $attrs.append !== 'undefined';
    }
  },
});
