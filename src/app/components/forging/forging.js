import moment from 'moment';

import './forging.less';

const UPDATE_INTERVAL = 20000;

app.component('forging', {
  template: require('./forging.pug')(),
  bindings: {
    account: '=',
  },
  controller: class forging {
    constructor($scope, $timeout, $peers) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.$peers = $peers;

      this.statistics = {};
      this.blocks = [];

      this.loadAllData();
    }

    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    loadAllData() {
      this.loadDelegate();
      this.loadForgedBlocks(10);

      this.loadForgingStats('today', moment().format('YYYY-MM-DD'));
      this.loadForgingStats('last24h', moment().subtract(1, 'days'));
      this.loadForgingStats('last7d', moment().subtract(7, 'days'));
      this.loadForgingStats('last30d', moment().subtract(30, 'days'));
      this.loadForgingStats('total', moment('2016-04-24 17:00'));
    }

    loadDelegate() {
      this.$peers.active.sendRequest('delegates/get', {
        publicKey: this.account.publicKey,
      }, (data) => {
        if (data.success) {
          this.delegate = data.delegate;
        } else {
          this.delegate = {};
        }
      });
    }

    loadForgedBlocks(limit, offset) {
      this.$timeout.cancel(this.timeout);

      this.$peers.active.sendRequest('blocks', {
        limit,
        offset: offset || 0,
        generatorPublicKey: this.account.publicKey,
      }, (data) => {
        if (data.success) {
          if (this.blocks.length === 0) {
            this.blocks = data.blocks;
          } else if (offset) {
            Array.prototype.push.apply(this.blocks, data.blocks);
          } else if (this.blocks[0].id !== data.blocks[0].id) {
            Array.prototype.unshift.apply(this.blocks,
              data.blocks.filter(block => block.timestamp < this.blocks[0].timestamp));
          }
          this.blocksLoaded = true;
          this.moreBlocksExist = this.blocks.length < data.count;
        }

        this.timeout = this.$timeout(this.loadAllData.bind(this), UPDATE_INTERVAL);
      });
    }

    loadMoreBlocks() {
      this.blocksLoaded = false;
      this.loadForgedBlocks(20, this.blocks.length);
    }

    loadForgingStats(key, startMoment) {
      this.$peers.active.sendRequest('delegates/forging/getForgedByAccount', {
        generatorPublicKey: this.account.publicKey,
        start: moment(startMoment).unix(),
        end: moment().unix(),
      }, (data) => {
        this.statistics[key] = data.forged;
      });
    }
  },
});

