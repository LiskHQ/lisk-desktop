import moment from 'moment';

import './timestamp.less';

const UPDATE_INTERVAL_UPDATE = 15000;

app.component('timestamp', {
  template: require('./timestamp.pug')(),
  bindings: {
    data: '<',
  },
  controller: class timestamp {
    constructor($scope, $timeout) {
      this.$timeout = $timeout;

      $scope.$watch('$ctrl.data', this.update.bind(this));
    }

    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    update() {
      this.$timeout.cancel(this.timeout);

      const obj = moment(timestamp.fix(this.data));
      this.full = obj.format('LL LTS');
      this.time_ago = obj.fromNow(true);

      this.timeout = this.$timeout(this.update.bind(this), UPDATE_INTERVAL_UPDATE);
    }

    static fix(value) {
      return new Date((((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + value) * 1000));
    }
  },
});
