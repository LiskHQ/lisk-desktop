/* istanbul ignore file */
import { publish, subscribe } from './utils';
import { IPC_MESSAGES, FUNCTION_TYPES } from './constants';
import manufacturers from './manufacturers';

// eslint-disable-next-line import/prefer-default-export
export class HwManager {
  constructor({ transports = {}, pubSub = {} }) {
    this.transports = transports;
    this.pubSub = pubSub;
    this.devices = [];
  }

  listening() {
    const { receiver } = this.pubSub;
    this.configure();

    subscribe(receiver, {
      event: IPC_MESSAGES.GET_CONNECTED_DEVICES_LIST,
      action: async () => this.getDevices(),
    });

    subscribe(receiver, {
      event: IPC_MESSAGES.CHECK_LEDGER,
      action: async ({ id }) => {
        const device = this.getDeviceById(id);
        this.updateDevice(
          await manufacturers[device.manufacturer].checkIfInsideLiskApp({
            transporter: this.transports[device.manufacturer],
            device,
          })
        );
      },
    });

    subscribe(receiver, {
      event: IPC_MESSAGES.HW_COMMAND,
      action: async ({ action, data }) => {
        const device = this.getDeviceById(data.deviceId);
        const functionName = FUNCTION_TYPES[action];
        const manufactureName = device.manufacturer;
        return manufacturers[manufactureName][functionName](this.transports[manufactureName], {
          device,
          data,
        });
      },
    });
  }

  /**
   * Set transport for specific type of wallet.
   * @param {object} data -> Object with type and transport
   * @param {string} data.name -> name of wallet brand. e.g. ledger, trezor
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
    return this.devices.find((d) => d.deviceId === id);
  }

  /**
   * Remove a specific hwWallet from the manager
   * @param {string} path - Path of hWWallet that should be removed
   */
  removeDevice(path) {
    const { sender } = this.pubSub;
    const device = this.devices.find((d) => d.path === path);
    this.devices = this.devices.filter((d) => d.path !== path);
    this.syncDevices();
    publish(sender, { event: IPC_MESSAGES.HW_DISCONNECTED, payload: { model: device.model } });
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
    const { sender } = this.pubSub;
    this.devices.push(device);
    this.syncDevices();
    publish(sender, { event: IPC_MESSAGES.HW_CONNECTED, payload: { model: device.model } });
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
    this.devices = this.devices.map((d) => (d.path === device.path ? device : d));
    this.syncDevices();
  }

  /**
   * Publish event through sender with deviceList
   */
  async syncDevices() {
    const { sender } = this.pubSub;
    publish(sender, {
      event: IPC_MESSAGES.DEVICE_LIST_CHANGED,
      payload: await this.getDevices(),
    });
  }

  pinCallback(type, callback) {
    const { receiver } = this.pubSub;
    receiver.once(IPC_MESSAGES.VALIDATE_PIN, (event, { pin }) => {
      if (pin) {
        callback(null, pin);
      } else {
        callback(IPC_MESSAGES.MISSING_PIN, null);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  passphraseCallback(callback) {
    callback(null, '' /* User passphrase here! */);
    /** TODO this is a quick workaround.
     * as pinCallback, this procedure needs to take the passphrase from the user
     * in order to unlock secret wallets (principle of plausible deniability).
     * More info: https://wiki.trezor.io/Passphrase
     */
  }

  /**
   * Start listeners set by setTransport
   */
  configure() {
    Object.keys(this.transports).forEach((key) => {
      manufacturers[key].listener(this.transports[key], {
        add: (data) => this.addDevice(data),
        remove: (data) => this.removeDevice(data),
        pinCallback: (type, callback) => this.pinCallback(type, callback),
        passphraseCallback: (callback) => this.passphraseCallback(callback),
      });
    });
  }
}
