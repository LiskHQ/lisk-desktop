import { IPC_MESSAGES } from '../consts';
import { HWClient } from './HWClient';

class HwManager extends HWClient {
  constructor() {
    super();
    this.activeDeviceID = null;
    this.currentDeviceStatus = 'disconnected';
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
    return this.device.filter((device) => device.id === this.activeDeviceID);
  }

  getDeviceInfoByID(id) {
    return this.device.filter((device) => device.id === id);
  }

  selectDevice(deviceId) {
    this.activeDeviceID = deviceId;
  }

  persistConnection() {
    this.subscribe(
      IPC_MESSAGES.DEVICE_LIST_CHANGED,
      this.getDevices.bind(this),
    );
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

  signMessage(accountIndex, message) {
    const signature = {
      deviceId: this.activeDeviceID,
      index: accountIndex,
      message,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.SIGN_MSG,
      data: signature,
    });
  }

  signTransaction(chainID, transactionBytes) {
    const index = this.device.findIndex((device) => device.id === this.activeDeviceID)
    const data = {
      deviceId: this.activeDeviceID,
      index,
      chainID,
      transactionBytes,
    };
    return this.executeCommand(
      IPC_MESSAGES.HW_COMMAND,
      {
        action: IPC_MESSAGES.SIGN_TRANSACTION,
        data,
      },
    );
  }

  checkIfInsideLiskApp() {
    // @todo Add Check If Inside Lisk App method here.
    return this;
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
