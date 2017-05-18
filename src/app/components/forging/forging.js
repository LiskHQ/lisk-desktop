import moment from 'moment';
import './forging.less';

const UPDATE_INTERVAL = 20000;

/**
 * The forging tab component
 *
 * @module app
 * @submodule forging
 */
app.component('forging', {
  template: require('./forging.pug')(),
  /**
   * The forging tab component constructor class
   *
   * @class forging
   * @constructor
   */
  controller: class forging {
    constructor($scope, $timeout, forgingService, Account) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.forgingService = forgingService;

      this.statistics = {};
      this.blocks = [];

      if (Account.get().publicKey) this.updateAllData();
      this.$scope.$on('accountChange', this.updateAllData.bind(this));
    }

    /**
     * @todo Tis should be rmeoved after using SyncService
     */
    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    /**
     * Needs summery
     * 
     * @method updateAllData
     */
    updateAllData() {
      this.updateDelegate();
      this.updateForgedBlocks(10);

      this.updateForgingStats('today', moment().set({'hour': 0, 'minute': 0, 'second': 0}));
      this.updateForgingStats('last24h', moment().subtract(1, 'days'));
      this.updateForgingStats('last7d', moment().subtract(7, 'days'));
      this.updateForgingStats('last30d', moment().subtract(30, 'days'));
      this.updateForgingStats('total', moment('2016-04-24 17:00'));
    }

    /**
     * Needs summery
     * 
     * @method updateDelegate
     */
    updateDelegate() {
      this.forgingService.getDelegate().then((data) => {
        this.delegate = data.delegate;
      }).catch(() => {
        this.delegate = {};
      });
    }

    /**
     * Call forgingService to fetch forged blocks considering the given limit and offset
     * If offset is not defined and the fetched and existing lists aren't identical,
     * it'll unshift assuming we're fetching new forged blocks 
     * 
     * @method updateForgedBlocks
     * @param {Number} limit 
     * @param {Number} offset 
     */
    updateForgedBlocks(limit, offset) {
      this.$timeout.cancel(this.timeout);

      this.forgingService.getForgedBlocks(limit, offset).then((data) => {
        if (this.blocks.length === 0) {
          this.blocks = data.blocks;
        } else if (offset) {
          Array.prototype.push.apply(this.blocks, data.blocks);
        } else if (this.blocks[0] && data.blocks[0] && this.blocks[0].id !== data.blocks[0].id) {
          Array.prototype.unshift.apply(this.blocks,
            data.blocks.filter(block => block.timestamp > this.blocks[0].timestamp));
        }
        this.blocksLoaded = true;
        this.moreBlocksExist = this.blocks.length < data.count;
      }).finally(() => {
        /**
         * @todo Replace this with SyncService
         */
        this.timeout = this.$timeout(this.updateAllData.bind(this), UPDATE_INTERVAL);
      });
    }

    /**
     * Fetches older blocks using updateForgedBlocks.
     * 
     * @method loadMoreBlocks
     * @todo Replace loader with a loader service
     */
    loadMoreBlocks() {
      this.blocksLoaded = false;
      this.updateForgedBlocks(20, this.blocks.length);
    }

    /**
     * Uses forgingService to update forging statistics
     * 
     * @method updateForgingStats
     * @param {String} key The key to categorize forged blocks stats.
     *  presently one of today, last24h, last7d, last30d, total.
     * @param {Object} startMoment The moment.js date object
     */
    updateForgingStats(key, startMoment) {
      this.forgingService.getForgedStats(startMoment).then((data) => {
        this.statistics[key] = data.forged;
      });
    }
  },
});
