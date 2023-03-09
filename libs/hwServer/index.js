/* istanbul ignore file */
import { publish, subscribe } from './utils';
import { DEVICE_STATUS, FUNCTION_TYPES, IPC_MESSAGES, METHOD_NAMES } from './constants';
import manufacturers from './manufacturers';

export class HwServer {
  constructor({ transports = {}, pubSub = {} }) {
    this.transports = transports;
    this.pubSub = pubSub;
    this.devices = [];
    this.currentDevice = {
      path: null,
      status: DEVICE_STATUS.DISCONNECTED,
      manufacturer: null
    };
    this.intervalId = null;
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
        const device = this.getCurrentDevice();
        const functionName = FUNCTION_TYPES[action];
        const manufactureName = device.manufacturer;
        return manufacturers[manufactureName][functionName](this.transports[manufactureName], {
          device,
          data,
        });
      },
    });
  }

  async statusListener() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const status = await this.checkStatus(this.currentDevice)
    if (status !== this.currentDevice.status) {
      this.currentDevice.status = status;
      await this.pushDeviceUpdate();
    }
    this.intervalId = setInterval(() => {
      this.statusListener()
    }, 5000);
  }

  async checkStatus({path, manufacturer}) {
    if (!path || !manufacturer) {
      return DEVICE_STATUS.DISCONNECTED;
    }
    return manufacturers[manufacturer].checkLiskAppStatus({
      transporter: this.transports[manufacturer],
      path,
    })
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

  async selectDevice({ path, manufacturer }) {
    const status = await this.checkStatus({path, manufacturer})
    this.currentDevice = {
      path,
      status,
      manufacturer
    };
    await this.statusListener();
    await this.pushDeviceUpdate();
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
  getDeviceByPath(path) {
    return this.devices.find((d) => d.path === path);
  }

  /**
   * Return the device with matching ID
   * @param {string} id - Id of device
   * @returns {promise} device found or undefined
   */
  getCurrentDevice() {
    const device = this.getDeviceByPath(this.currentDevice.path);
    return {
      ...device,
      status: this.currentDevice.status,
    };
  }

  /**
   * Remove a specific hwWallet from the manager
   * @param {string} path - Path of hWWallet that should be removed
   */
  async removeDevice(path) {
    const { sender } = this.pubSub;
    const removedDevice = await this.getDeviceByPath(path);
    this.devices = this.devices.filter((d) => d.path !== path);
    await this.pushDevicesListChange();
    publish(sender, { event: IPC_MESSAGES.HW_DISCONNECTED, payload: removedDevice });
  }

  /**
   * Add device to devices list
   * @param {Object} device - Device object containing (deviceId, model, label, path)
   * @param {string} device.deviceId
   * @param {string} device.label
   * @param {string} device.model
   * @param {string} device.path
   */
  async addDevice(device) {
    const { sender } = this.pubSub;
    this.devices.push(device);
    await this.pushDevicesListChange();
    if (this.devices.length === 1) {
      await this.selectDevice(device);
    }
    publish(sender, {
      event: IPC_MESSAGES.HW_CONNECTED,
      payload: { model: device.model, devices: this.devices },
    });
  }

  /**
   * Publish event through sender with deviceList
   */
  async pushDevicesListChange() {
    const { sender } = this.pubSub;
    const devices = await this.getDevices();
    publish(sender, {
      event: IPC_MESSAGES.DEVICE_LIST_CHANGED,
      payload: devices,
    });
  }

  /**
   * Publish event through sender with deviceId
   */
  async pushDeviceUpdate() {
    const { sender } = this.pubSub;
    const currentDevice = this.getCurrentDevice();
    publish(sender, {
      event: IPC_MESSAGES.DEVICE_UPDATE,
      payload: currentDevice,
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
