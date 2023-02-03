/* eslint-disable class-methods-use-this */
import { IPC_MESSAGES } from '../consts';
import { HWClient } from './HWClient';

class HwManager extends HWClient {
  constructor() {
    super();
    this.activeDeviceID = null;
    this.currentDeviceStatus = 'disconnected';
    this.devices = [];
  }

  createAccount() {}

  getAccounts() {}

  getDeviceList() {
    // this.executeCommand(IPC_MESSAGES.GET_CONNECTED_DEVICES_LIST, null)
    return this.devices;
  }

  getCurrentDeviceInfo() {
    // return this.device.filter((device) => device.id == this.activeDeviceID)
  }

  getDeviceInfoByID() {}

  selectDevice(deviceId) {
    this.activeDeviceID = deviceId;
  }

  persistConnection() {}

  getPublicKey() {}

  getAddress(accountIndex) {
    const data = {
      deviceId: this.activeDeviceID,
      showOnDevice: true,
      index: accountIndex,
    };
    return this.executeCommand(IPC_MESSAGES.HW_COMMAND, {
      action: IPC_MESSAGES.GET_ADDRESS,
      data,
    });
  } // dump this on #4767

  listeningToDevices() {
    // @todo may this devices list provided by the HWServer check for the event DEVICE_LIST_CHANGED or GET_CONNECTED_DEVICES_LIST
    // this.subsscribe('connect', (newDevice) => {
    //   const hasDevice = this.devices.find((device) => {
    //     return // device.id === newDevice.id
    //   })
    //   if (!hasDevice) {
    //     this.devices.push(device)
    //   }
    // })
    //
    // this.subsscribe('disconnected', (device) => {
    //   this.devices = this.devices.find((device) => {
    //     return // device.id !== newDevice.id
    //   })
    // })
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

  signTransaction() {}

  checkIfInsideLiskApp() {}

  validatePin() {}

  reconnectDevice(cb) {
    console.log(cb);
  }
}

export default new HwManager();
