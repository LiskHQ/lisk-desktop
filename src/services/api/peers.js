import lisk from 'lisk-js';

/**
 * This factory provides methods for communicating with peers. It exposes
 * sendRequestPromise method for requesting to available endpoint to the active peer,
 * so we need to set the active peer using `setActive` method before using other methods
 *
 * @module app
 * @submodule Peers
 */
app.factory('Peers', ($timeout, $cookies, $location, $q, $rootScope, dialog) => {
  /**
   * The Peers factory constructor class
   *
   * @class Peers
   * @constructor
   */
  class Peers {
    constructor() {
      $rootScope.$on('syncTick', () => {
        if (this.active) this.check();
      });
    }

    /**
     * Delegates the active peer
     *
     * @param {Boolean} active - defines if the function should delete the active peer
     *
     * @memberOf Peers
     * @method reset
     * @todo Since the usage of this function without passing active parameter
     *  doesn't perform any action, this function and its use-cases must be revised.
     */
    reset(active) {
      if (active) {
        this.active = undefined;
      }
    }

    /**
     * User Lisk.js to set the active peer. if network is not passed
     * a peer will be selected in random base.
     * Also checks the status of the network
     *
     * @param {Object} [network] - The network to be set as active
     *
     * @memberOf Peers
     * @method setActive
     */
    setActive(network) {
      const addHttp = (url) => {
        const reg = /^(?:f|ht)tps?:\/\//i;
        return reg.test(url) ? url : `http://${url}`;
      };

      this.network = network;
      let conf = { };
      if (network) {
        conf = network;
        if (network.address) {
          const normalizedUrl = new URL(addHttp(network.address));

          conf.node = normalizedUrl.hostname;
          conf.port = normalizedUrl.port;
          conf.ssl = normalizedUrl.protocol === 'https';
        }
        if (conf.testnet === undefined && conf.port !== undefined) {
          conf.testnet = conf.port === '7000';
        }
      }

      this.active = lisk.api(conf);
      this.wasOffline = false;
      return this.check();
    }

    /**
     * Converts the callback-based peer.active.sendRequest to promise
     *
     * @param {String} api - The relative path of the endpoint
     * @param {any} [urlParams] - The parameters of the request
     * @returns {promise} Api call promise
     *
     * @memberOf Peer
     * @method sendRequestPromise
     */
    sendRequestPromise(api, urlParams) {
      const deferred = $q.defer();
      this.active.sendRequest(api, urlParams, (data) => {
        if (data.success) {
          return deferred.resolve(data);
        }
        return deferred.reject(data);
      });
      return deferred.promise;
    }

    /**
     * Gets the basic status of the account. and sets the online/offline status
     *
     * @private
     * @memberOf Peer
     * @method check
     */
    check() {
      return this.sendRequestPromise('loader/status', {})
        .then(() => {
          this.online = true;
          if (this.wasOffline) {
            dialog.successToast('Connection re-established');
            $rootScope.$emit('hideLoadingBar', 'connection');
          }
          this.wasOffline = false;
        })
        .catch((data) => {
          this.online = false;
          if (!this.wasOffline) {
            const address = `${this.active.currentPeer}:${this.active.port}`;
            let message = `Failed to connect to node ${address}. `;
            if (data && data.error && data.error.code === 'EUNAVAILABLE') {
              message = `Failed to connect: Node ${address} is not active`;
            } else if (!(data && data.error && data.error.code)) {
              message += ' Make sure that you are using the latest version of Lisk Nano.';
            }
            dialog.errorToast(message);
            $rootScope.$emit('showLoadingBar', 'connection');
          }
          this.wasOffline = true;
        });
    }
  }

  return new Peers();
});
