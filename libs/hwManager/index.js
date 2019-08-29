/* istanbul ignore file */
import manufacturers from './manufacturers';
import { publish, subscribe } from './utils';

class HwManager {
  constructor({
    transports = {},
    pubSub = {},
  }) {
    this.transports = transports;
    this.pubSub = pubSub;
    this.devices = [];
  }

  init() {
    this.startListeners();
    subscribe(this.pubSub.receiver, {
      event: 'getConnectedDevicesList',
      action: async () => this.getDevices(),
    });
  }

  /**
   * Set transport for specific type of wallet.
   * @param {object} data -> Object with type and transport
   * @param {string} data.name -> name of wallet brand. eg. ledger, trezor
   * @param {any} data.transport -> Transport used to communicate with the wallets
   */
  setTransport({ name, transport }) {
    this.transports[name] = transport;
  }

  /**
   * Returns list  of connected devices
   * @returns {promise} Promise object with list of devices
   */
  async getDevices() {
    return Promise.resolve(this.devices);
  }

  /**
   * Remove a specific hwWallet from the manager
   * @param {string} path - Path of hWWallet that shoud be removed
   */
  removeDeviceWithPath(path) {
    this.devices = this.devices.filter(d => d.path !== path);
    this.syncDevices();
  }

  /**
   * Add device to devices list
   * @param {Object} device - Device object containing (deviceId, model, label, path)
   * @param {string} device.deviceId
   * @param {string} device.label
   * @param {string} device.model
   * @param {string} device.path
   */
  addDevice(device) {
    this.devices.push(device);
    this.syncDevices();
  }

  /**
   * Publish event throught sender with deviceList
   */
  async syncDevices() {
    const { sender } = this.pubSub;
    publish(sender, {
      event: 'hwDeviceListChanged',
      payload: await this.getDevices(),
    });
  }

  /**
   * Start listeners set by setTransport
   */
  startListeners() {
    Object.keys(this.transports).forEach((key) => {
      try {
        manufacturers[key].listener(this.transports[key], {
          add: data => this.addDevice(data),
          remove: data => this.removeDeviceWithPath(data),
        });
      } catch (e) {
        throw e;
      }
    });
  }
}

export default HwManager;
