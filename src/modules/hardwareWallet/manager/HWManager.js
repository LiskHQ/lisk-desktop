import { IPC_MESSAGES } from '@libs/hwServer/constants';
import { HWClient } from './HWClient';

class HwManager extends HWClient {
  createAccount() {
    // @todo Add Create Account method here.
    return this;
  }

  getDevices() {
    return this.invoke({
      action: IPC_MESSAGES.GET_DEVICES,
    });
  }

  getActiveDeviceInfo() {
    return this.invoke({
      action: IPC_MESSAGES.GET_ACTIVE_DEVICE,
    });
  }

  getDeviceInfoByID(id) {
    return this.invoke({
      action: IPC_MESSAGES.GET_DEVICE,
      data: { id },
    });
  }

  selectDevice(id) {
    return this.invoke({
      action: IPC_MESSAGES.SELECT_DEVICE,
      data: { id },
    });
  }

  persistConnection() {
    this.subscribe(IPC_MESSAGES.DEVICE_LIST_CHANGED, this.getDevices.bind(this));
  }

  // Returns the account publicKey corresponding given account index
  getPublicKey(index) {
    return this.executeCommand({
      action: IPC_MESSAGES.GET_PUBLIC_KEY,
      data: { index },
    });
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
      index,
      message,
    };
    return this.executeCommand({
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
      index,
      chainID,
      transactionBytes,
    };
    return this.executeCommand({
      action: IPC_MESSAGES.SIGN_TRANSACTION,
      data,
    });
  }

  /**
   * This method is used to check the status of the Ledger App
   * It updates the status on the class and the React components can
   * access it in turn
   * @returns {string} connected or disconnected
   */
  // @todo rename to updateDevices
  async checkAppStatus() {
    await this.invoke({
      action: IPC_MESSAGES.CHECK_STATUS,
    });
    const devices = await this.getDevices();
    return devices;
  }
}

export default new HwManager();
