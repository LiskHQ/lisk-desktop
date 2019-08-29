import { models } from '../../../src/constants/hwConstants';

const listener = (transport, actions) => {
  transport.on('connect', (device) => {
    actions.add({
      deviceId: device.features.device_id,
      label: device.features.label,
      model: device.features.model === '1' ? models.trezorOne : models.trezorModelT,
      path: device.originalDescriptor.path,
    });
  });
  transport.on('disconnect', (device) => {
    actions.remove(device.originalDescriptor.path);
  });
};

export default {
  listener,
};
