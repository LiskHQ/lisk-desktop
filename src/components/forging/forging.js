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
    constructor($scope, $timeout, forgingApi, Account) {
      this.$scope = $scope;
      this.$timeout = $timeout;
      this.forgingApi = forgingApi;
      this.account = Account;

      this.statistics = {};
      this.blocks = [];

      if (Account.get().publicKey) this.updateAllData();
      this.$scope.$on('accountChange', this.updateAllData.bind(this));
    }

    /**
     * @todo This should be removed after using SyncService
     */
    $onDestroy() {
      this.$timeout.cancel(this.timeout);
    }

    /**
     * Needs summary
     *
     * @method updateAllData
     */
    updateAllData() {
      this.delegate = this.account.get().delegate || {};
      this.updateForgedBlocks(20, 0, true);

      this.updateForgingStats('last24h', moment().subtract(1, 'days'));
      this.updateForgingStats('last7d', moment().subtract(7, 'days'));
      this.updateForgingStats('last30d', moment().subtract(30, 'days'));
      this.updateForgingStats('last365d', moment().subtract(365, 'days'));
      this.updateForgingStats('total', moment('2016-04-24 17:00'));
    }

    /**
     * Call forgingApi to fetch forged blocks considering the given limit and offset
     * If offset is not defined and the fetched and existing lists aren't identical,
     * it'll unshift assuming we're fetching new forged blocks
     *
     * @method updateForgedBlocks
     * @param {Number} limit
     * @param {Number} offset
     * @param {Bool} showLoadingBar
     */
    updateForgedBlocks(limit, offset, showLoadingBar) {
      this.$timeout.cancel(this.timeout);
      if (showLoadingBar) {
        this.$scope.$emit('showLoadingBar');
      }

      this.forgingApi.getForgedBlocks(limit, offset).then((data) => {
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
        this.$scope.$emit('hideLoadingBar');
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
      if (this.blocksLoaded && this.blocks.length !== 0 && this.moreBlocksExist) {
        this.blocksLoaded = false;
        this.updateForgedBlocks(20, this.blocks.length, true);
      }
    }

    /**
     * Uses forgingApi to update forging statistics
     *
     * @method updateForgingStats
     * @param {String} key The key to categorize forged blocks stats.
     *  presently one of today, last24h, last7d, last30d, total.
     * @param {Object} startMoment The moment.js date object
     */
    updateForgingStats(key, startMoment) {
      this.forgingApi.getForgedStats(startMoment).then((data) => {
        this.statistics[key] = data.forged;
      });
    }
  },
});
