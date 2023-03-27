const peer = (index) => ({
  ip: `94.130.96.${index}`,
  httpPort: 5000,
  wsPort: 5001,
  os: 'linux4.15.0-76-generic',
  version: `3.0.0-beta.${index}`,
  state: 2,
  height: 25941 + index,
  location: {
    countryCode: 'DE',
    ip: `94.130.96.${index}`,
    latitude: '51.2993',
    longitude: '9.491',
  },
});

const peers = Array(30)
  .fill(1)
  .map((item, index) => peer(index));

export default peers;
