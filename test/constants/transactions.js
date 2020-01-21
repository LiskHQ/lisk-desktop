const transaction = index => ({
  id: `1402835196409030464${index}`,
  height: 9381199 + index,
  blockId: `35335302495521273${index}`,
  type: 0,
  timestamp: 106359314,
  senderPublicKey: 'f4852b270f76dc8b49bfa88de5906e81d3b001d23852f0e74ba60cac7180a184',
  recipientPublicKey: '',
  senderId: `60766716343473650${index}L`,
  recipientId: `162819183031167495${index}L`,
  amount: `${index}00000000`,
  fee: '10000000',
  signature: 'bbd659c908a609e27b491aeb429038fa8638b7eaed357043e5fbd463658caf7e9777b8b53f3d5e3ef4b6280e55d264b30162319eee24c3844c7c65974200ed00',
  signatures: [],
  asset: {},
  confirmations: 98 + index,
});

const transactions = Array(30).fill(1).map((item, index) => transaction(index));

export default transactions;
