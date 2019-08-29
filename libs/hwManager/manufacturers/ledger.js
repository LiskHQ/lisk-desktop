let devices = [];
const clearDevices = async (transport, { remove }) => {
  const connectedPaths = await transport.list();
  devices
    .filter(device => !connectedPaths.includes(device))
    .forEach(device => remove(device));
  devices = devices.filter(device => connectedPaths.includes(device));
};

const listener = (transport, actions) => {
  try {
    transport.listen({
      next: ({ type, deviceModel, descriptor }) => {
        if (deviceModel && descriptor) {
          if (type === 'add') {
            clearDevices(transport, actions);
            devices.push(descriptor);
            actions.add({
              deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
              label: deviceModel.productName,
              model: deviceModel.productName,
              path: descriptor,
            });
          } else if (type === 'remove') {
            clearDevices(transport, actions);
          }
        }
      },
    });
  } catch (e) {
    throw e;
  }
};

export default {
  listener,
};
