import moment from 'moment';

import './forging.less';

const UPDATE_INTERVAL = 20000;

app.component('forging', {
  template: require('./forging.pug')(),
  controller: class forging {
    constructor($scope, $timeout, forgingService, Account) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.forgingService = forgingService;

      this.statistics = {};
      this.blocks = [];
      if (Account.get().publicKey) {
        this.$scope.$on('onAccountChange', () => {
          this.updateAllData();
        });
      } else {
        this.updateAllData();
      }
    }

    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    updateAllData() {
      this.updateDelegate();
      this.updateForgedBlocks(10);

      this.updateForgingStats('today', moment().format('YYYY-MM-DD'));
      this.updateForgingStats('last24h', moment().subtract(1, 'days'));
      this.updateForgingStats('last7d', moment().subtract(7, 'days'));
      this.updateForgingStats('last30d', moment().subtract(30, 'days'));
      this.updateForgingStats('total', moment('2016-04-24 17:00'));
    }

    updateDelegate() {
      this.forgingService.getDelegate().then((data) => {
        this.delegate = data.delegate;
      }).catch(() => {
        this.delegate = {};
      });
    }

    updateForgedBlocks(limit, offset) {
      this.$timeout.cancel(this.timeout);

      this.forgingService.getForgedBlocks(limit, offset).then((data) => {
        if (this.blocks.length === 0) {
          this.blocks = data.blocks;
        } else if (offset) {
          Array.prototype.push.apply(this.blocks, data.blocks);
        } else if (this.blocks[0].id !== data.blocks[0].id) {
          Array.prototype.unshift.apply(this.blocks,
            data.blocks.filter(block => block.timestamp > this.blocks[0].timestamp));
        }
        this.blocksLoaded = true;
        this.moreBlocksExist = this.blocks.length < data.count;
      }).finally(() => {
        this.timeout = this.$timeout(this.updateAllData.bind(this), UPDATE_INTERVAL);
      });
    }

    loadMoreBlocks() {
      this.blocksLoaded = false;
      this.updateForgedBlocks(20, this.blocks.length);
    }

    updateForgingStats(key, startMoment) {
      this.forgingService.getForgedStats(startMoment).then((data) => {
        this.statistics[key] = data.forged;
      });
    }
  },
});

