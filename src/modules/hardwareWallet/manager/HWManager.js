import { IPC_MESSAGES, DEVICE_STATUS } from '../consts';
import { HWClient } from './HWClient';

class HwManager extends HWClient {
  constructor() {
    super();
    this.activeDeviceID = null;
    this.currentDeviceStatus = DEVICE_STATUS.DISCONNECTED;
    this.devices = [];
  }

  createAccount() {
    // @todo Add Create Account method here.
    return this;
  }

  async getDevices() {
    this.devices = await this.executeCommand(IPC_MESSAGES.GET_CONNECTED_DEVICES_LIST);
    return this.devices;
  }

  getCurrentDeviceInfo() {
    return this.devices.filter((device) => device.id === this.activeDeviceID);
  }

  getDeviceInfoByID(id) {
    return this.devices.filter((device) => device.id === id);
  }

  selectDevice(deviceId) {
    this.activeDeviceID = deviceId;
  }

  persistConnection() {
    this.subscribe(IPC_MESSAGES.DEVICE_LIST_CHANGED, this.getDevices.bind(this));
    // setTimeout(this.getDevices.bind(this), 0); // @todo Why the setTimeout?
  }

  // Returns the account publicKey corresponding given account index
  getPublicKey(index) {
    const data = {
      deviceId: this.activeDeviceID,
      showOnDevice: true,
      index,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.GET_PUBLIC_KEY,
      data,
    });
  }

  // Returns the account address corresponding given account index
  getAddress(index) {
    const data = {
      deviceId: this.activeDeviceID,
      showOnDevice: true,
      index,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.GET_ADDRESS,
      data,
    });
  } // dump this on #4767

  listeningToDevices() {
    // @todo may this devices list provided by the HWServer check for the
    // event DEVICE_LIST_CHANGED or GET_CONNECTED_DEVICES_LIST
    return this;
  }

  /**
   * Signs a given transaction for a given account index
   * The account index must be a parameter to match the
   * signTransaction method signature
   *
   * @param {number} index Account index
   * @param {string} message
   * @returns {promise}
   */
  signMessage(index, message) {
    const signature = {
      deviceId: this.activeDeviceID,
      index,
      message,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.SIGN_MSG,
      data: signature,
    });
  }

  /**
   * Signs a given transaction for a given account index
   * The account index must be a parameter since we may
   * need to sign a transaction for a different account
   * via WalletConnect
   *
   * @param {number} index Account index
   * @param {Buffer} chainID
   * @param {Buffer} transactionBytes
   * @returns {promise}
   */
  signTransaction(index, chainID, transactionBytes) {
    const data = {
      deviceId: this.activeDeviceID,
      index,
      chainID,
      transactionBytes,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.SIGN_TRANSACTION,
      data,
    });
  }

  /**
   * This method is used to check the status of the Ledger App
   * If updates the status on the class and the React components can
   * access it in turn
   * @returns {string} connected or disconnected
   */
  async checkAppStatus() {
    await  this.executeCommand(IPC_MESSAGES.CHECK_LEDGER, { id: this.activeDeviceID });
    await this.getDevices();
    return this.devices;
  }

  validatePin() {
    // @todo Add Validate Pin method here.
    return this;
  }

  reconnectDevice() {
    // @todo Add Reconnect Device method here.
    return this;
  }
}

export default new HwManager();
