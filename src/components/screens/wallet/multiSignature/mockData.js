export const multisignGroups = [
  {
    id: 1,
    address: '6195226421328336181L',
    name: 'Wilson Geidt',
    key: '8155694652104526882',
    balance: '127900000000',
  },
  {
    id: 2,
    address: '2233116421388836181L',
    balance: '3162000000000',
  },
  {
    id: 3,
    address: '9777226421128322133L',
    balance: '1525300000000',
  },
];

export const transactionsData = {
  1: [
    {
      sender: { address: '7775299921311136181L', publicKey: '8155694652104526882', title: 'Wilson Geidt' },
      recipient: { address: '6195226421328336181L' },
      amount: '10000000000',
      status: 1,
    },
    {
      sender: { address: '6195226421328336181L' },
      recipient: { address: '5059876081639179984L' },
      amount: '2000000000',
      status: 2,
    },
    {
      sender: { address: '5195226421328336181L' },
      recipient: { address: '1295226421328336181L' },
      amount: '50000000000',
      status: 3,
    },
  ],
  2: [
    {
      sender: { address: '8463226421328336181L' },
      recipient: { address: '4059876081639179984L' },
      amount: '3000000000',
      status: 2,
    },
    {
      sender: { address: '8885299921311136181L', publicKey: '8155694652104526882', title: 'Lola Flores' },
      recipient: { address: '3195226421328336181L' },
      amount: '4000000000',
      status: 1,
    },
    {
      sender: { address: '3195226421328336333L' },
      recipient: { address: '2295226421328336181L' },
      amount: '6000000000',
      status: 2,
    },
    {
      sender: { address: '1125226321428637181L' },
      recipient: { address: '7295226421328336181L' },
      amount: '900000000000',
      status: 3,
    },
  ],
  3: [
    {
      sender: { address: '5555226411328836781L' },
      recipient: { address: '5059876081639179984L' },
      amount: '150000000000',
      status: 1,
    },
    {
      sender: { address: '1295226421328336181L' },
      recipient: { address: '31295226421328336181L' },
      amount: '37000000000',
      status: 3,
    },
  ],
};
