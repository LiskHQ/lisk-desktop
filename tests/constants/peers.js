const peer = (index) => ({
  ip: `94.130.96.${index}`,
  port: 5000,
  networkVersion: `3.0.0-beta.${index}`,
  state: "connected",
  height: 25941 + index,
  location: {
    countryCode: 'DE',
    latitude: '51.2993',
    longitude: '9.491',
  },
});

const peers = Array(30)
  .fill(1)
  .map((item, index) => peer(index));

export default peers;
