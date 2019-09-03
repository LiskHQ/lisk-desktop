/* istanbul ignore file */
import manufacturers from './manufacturers';
import { publish, subscribe } from './utils/utils';

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
    const { receiver } = this.pubSub;
    this.startListeners();

    // TODO use contants instead of hardcoded text for events
    subscribe(receiver, {
      event: 'getConnectedDevicesList',
      action: async () => this.getDevices(),
    });

    // TODO use contants instead of hardcoded text for events
    subscribe(receiver, {
      event: 'checkLedger',
      action: async ({ id }) => {
        const device = this.getDeviceById(id);
        this.updateDevice(await manufacturers[device.manufactor].checkIfInsideLiskApp({
          transporter: this.transports[device.manufactor],
          device,
        }));
      },
    });

    // TODO use contants instead of hardcoded text for events
    subscribe(receiver, {
      event: 'hwCommand',
      action: async ({ action, data }) => {
        const device = this.getDeviceById(data.deviceId);
        return manufacturers[device.manufactor]
          .executeCommand(this.transports[device.manufactor], {
            device,
            action,
            data,
          });
      },
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
   * Return the device with matching ID
   * @param {string} id - Id of device
   * @returns {promise} device found or undefined
   */
  getDeviceById(id) {
    return this.devices.find(d => d.deviceId === id);
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
   * Update device on devices list based on the path
   * @param {Object} device - Device object containing (deviceId, model, label, path)
   * @param {string} device.deviceId
   * @param {string} device.label
   * @param {string} device.model
   * @param {string} device.path
   */
  updateDevice(device) {
    this.devices = this.devices.map(d => (d.path === device.path ? device : d));
    this.syncDevices();
  }

  /**
   * Publish event throught sender with deviceList
   */
  async syncDevices() {
    const { sender } = this.pubSub;
    // TODO use contants instead of hardcoded text for events
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
