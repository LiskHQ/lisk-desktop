import manufactures from './manufactures';

export class HwManager {
  constructor() {
    this.transports = {};

    this.devices = [];
  }

  /**
   * Set transport for specific type of wallet.
   * @param {object} data -> Object with type and transport
   * @param {string} data.name -> name of wallet brand. eg. ledger, trezor
   * @param {any} data.transport -> Transport used to communicate with the wallets
   */
  setTransport({ name, transport }) {
    // console.log('set', { type, transport });
    this.transports[name] = transport;
    // console.log('set', this.transports);
  }

  /**
   * Remove a specific hwWallet from the manager
   * @param {string} descriptor - Path of hWWallet that shoud be removed
   */
  removeDeviceWithPath(descriptor) {
    const index = this.devices.findIndex(d => d.path === descriptor);
    this.devices = [...this.devices.slice(0, index), ...this.devices.slice(index + 1)];
  }

  listener() {
    try {
      this.transports.ledger.listen({
        next: ({ type, ...args }) => {
          // console.log({ args, type });
          if (type === 'add') {
            const device = {
              id: Math.random() * 1e4 + 1,
              path: args.descriptor,
              ...args.deviceModel,
            };
            this.devices.push(device);
          } else if (type === 'remove') {
            const device = this.devices.findIndex(d => d.path === args.descriptor);
            this.devices = [...this.devices.slice(0, device), ...this.devices.slice(device + 1)];
          }
          console.log(this.devices);
        },
      });
    } catch (e) {
      console.log({ e });
    }
  }
}

export default new HwManager();
