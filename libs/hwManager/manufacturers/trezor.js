/* istanbul ignore file */
/* eslint-disable no-bitwise */
import { models } from '../../../src/constants/hwConstants';

const listener = (transport, actions) => {
  transport.on('connect', (device) => {
    actions.add({
      deviceId: device.features.device_id,
      label: device.features.label,
      model: device.features.model === '1' ? models.trezorOne : models.trezorModelT,
      path: device.originalDescriptor.path,
      manufactor: 'trezor',
    });
  });

  transport.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('Trezor Error: ', error);
  });

  transport.on('disconnect', (device) => {
    actions.remove(device.originalDescriptor.path);
  });

  process.on('exit', () => {
    transport.onbeforeunload();
  });
};

const hardeningConstant = 0x80000000;
const getHardenedPath = index => [
  (44 | hardeningConstant) >>> 0,
  (134 | hardeningConstant) >>> 0,
  (index | hardeningConstant) >>> 0,
];

const executeCommand = (transporter, {
  device,
  action,
  data,
}) => {
  const trezorDevice = transporter.asArray()
    .find(d => d.features.device_id === device.deviceId);
  if (!trezorDevice) {
    Promise.reject(new Error('DEVICE_IS_NOT_CONNECTED'));
  }

  return new Promise((resolve, reject) => {
    trezorDevice.waitForSessionAndRun(async (session) => {
      switch (action) {
        case 'GET_PUBLICKEY': {
          const { message } = await session.typedCall(
            'LiskGetPublicKey',
            'LiskPublicKey',
            {
              address_n: getHardenedPath(data.index),
              show_display: data.showOnDevice,
            },
          );
          return resolve(message.public_key);
        }
        default: {
          // eslint-disable-next-line no-console
          console.log(`No action created for: ${device.manufactor}.${action}`);
          return reject(new Error(`No action created for: ${device.manufactor}.${action}`));
        }
      }
    });
  });
};

export default {
  listener,
  executeCommand,
};
