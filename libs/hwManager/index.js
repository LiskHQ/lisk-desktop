import manufactures from './manufactures';

export const hwManager = () => ({
  transports: {
    ledger: null,
    trezor: null,
  },

  devices: [],

  setTransport: ({ type = 'ledger', transport }) => { 
    console.log('set', { type, transport });
    console.log('set', this.transports);
    this.transports[type] = transport;
  },
  getDevices: async (type = 'ledger') => { await this.transports[type].list(); },
  listener: () => {
    try {
      this.transports.ledger.setListenDevicesPollingSkip(() => false);
      this.transports.ledger.setListenDevicesDebounce(0);
      this.transports.ledger.listen({
        next: ({ device, type }) => {
          console.log({ device, type });
        },
      });
    } catch (e) {
      console.log({ e });
    }
  },
});

const isDataValid = (data) => {
  console.log('validating data => ', data);
  return true;
};

const devicesListener = () => manufactures.devicesListener();

const getConnectedDevices = () => manufactures.getConnectedDevices();

const getDeviceById = ({ name, id }) => manufactures.getDeviceById(name, id);

const getPublicKey = ({ name, id, data }) => {
  if (isDataValid(data)) {
    manufactures.getPublicKey({ name, id, data });
  } else {
    console.log('DATA INVALID');
  }
};

const getAddress = ({ name, id, data }) => {
  if (isDataValid(data)) {
    manufactures.getAddress({ name, id, data });
  } else {
    console.log('DATA INVALID');
  }
};

const getAccounts = ({ name, id, data }) => {
  if (isDataValid(data)) {
    manufactures.getAccounts({ name, id, data });
  } else {
    console.log('DATA INVALID');
  }
};

const signInTransaction = ({ name, id, data }) => {
  if (isDataValid(data)) {
    manufactures.signInTransaction({ name, id, data });
  } else {
    console.log('DATA INVALID');
  }
};

const signInMessage = ({ name, id, data }) => {
  if (isDataValid(data)) {
    manufactures.signInMessage({ name, id, data });
  } else {
    console.log('DATA INVALID');
  }
};

const checkStatus = ({ name, id }) => manufactures.signInMessage({ name, id });

export default {
  checkStatus,
  devicesListener,
  getAccounts,
  getAddress,
  getConnectedDevices,
  getDeviceById,
  getPublicKey,
  signInMessage,
  signInTransaction,
};
