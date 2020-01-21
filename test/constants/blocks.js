const names = [
  'menfei',
  'forger_of_lisk',
  'xujian',
  'jixie',
  'elonhan',
  'ntelo',
  'menfei',
];

const block = index => ({
  id: `35998991827805762${index}`,
  height: 10322980 + index,
  version: 1,
  timestamp: 1569853530,
  generatorAddress: '731774066839038986L',
  generatorPublicKey: '88260051bbe6634431f8a2f3ac66680d1ee9ef1087222e6823d9b4d81170edc7',
  generatorUsername: names[index % (names.length - 1)],
  payloadLength: 0,
  payloadHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  blockSignature: '30f35a56dae4c0d0af847aadb66528cc6facddfb05f87492b603b0252c3c3821a27e3e4716909d9acc954ebcdabdfee60b832b9ded1b7db85b64d87ae79a1f00',
  confirmations: index + 1,
  previousBlockId: '15803272929327530764',
  numberOfTransactions: index % 10,
  totalAmount: index === 0 ? '0' : `${index}0000000`,
  totalFee: index === 0 ? '0' : `${index}000000`,
  reward: '300000000',
  totalForged: `${30 + index}0000000`,
});

const blocks = Array(30).fill(1).map((item, index) => block(index));

export default blocks;
