/* istanbul ignore file */
import { publish, subscribe } from './utils';
import { IPC_MESSAGES, FUNCTION_TYPES, METHOD_NAMES } from './constants';
import manufacturers from './manufacturers';

export class HwServer {
  constructor({ transports = {}, pubSub = {} }) {
    this.transports = transports;
    this.pubSub = pubSub;
    this.devices = [];
    this.currentDeviceId = null;
  }

  listening() {
    const { receiver } = this.pubSub;
    this.configure();

    /**
     * Use this event to call HWServer internal methods
     * To manipulate and retrieve stored devices data
     */
    subscribe(receiver, {
      event: IPC_MESSAGES.INVOKE,
      action: ({ action, data }) => {
        const methodName = METHOD_NAMES[action];
        return this[methodName](data);
      },
    });

    /**
     * Use this event to call functions in manufacturer
     * directory to communicate with the hardware wallets
     */
    subscribe(receiver, {
      event: IPC_MESSAGES.HW_COMMAND,
      action: async ({ action, data }) => {
        const device = this.getDeviceById(this.currentDeviceId);
        const functionName = FUNCTION_TYPES[action];
        const manufactureName = device.manufacturer;
        return manufacturers[manufactureName][functionName](this.transports[manufactureName], {
          device,
          data,
        });
      },
    });
  }

  async checkLedger() {
    const device = this.getDeviceById(this.currentDeviceId);
    const devices = await manufacturers[device.manufacturer].checkIfInsideLiskApp({
      transporter: this.transports[device.manufacturer],
      device,
    });
    this.updateDevice(devices);
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

  async selectDevice({ id }) {
    this.currentDeviceId = id;
    this.deviceUpdate(id);
    return this.currentDeviceId;
  }

  /**
   * Returns list  of connected devices
   * @returns {promise} Promise object with list of devices
   */
  async getDevices() {
    return this.devices;
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
    publish(sender, {
      event: IPC_MESSAGES.HW_CONNECTED,
      payload: { model: device.model, devices: this.devices },
    });
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

  /**
   * Publish event through sender with deviceId
   */
  deviceUpdate(deviceId) {
    const { sender } = this.pubSub;
    publish(sender, {
      event: IPC_MESSAGES.DEVICE_UPDATE,
      payload: { deviceId },
    });
  }

  /**
   * Start listeners set by setTransport
   */
  configure() {
    Object.keys(this.transports).forEach((key) => {
      manufacturers[key].listener(this.transports[key], {
        add: (data) => this.addDevice(data),
        remove: (data) => this.removeDevice(data),
      });
    });
  }
}
