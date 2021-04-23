const accounts = {
  genesis: {
    passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
    summary: {
      publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      serverPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      balance: '9897000000000000',
      isMigrated: true,
    },
    token: { balance: '9897000000000000' },
    sequence: { nonce: '1' },
    dpos: {
      delegate: {},
    },
  },
  delegate: {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    summary: {
      publicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
      serverPublicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
      address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
      balance: 1000e8,
    },
    token: { balance: 1000e8 },
    sequence: { },
    dpos: {
      delegate: {
        username: 'genesis_17',
        consecutiveMissedBlocks: 0,
        isBanned: false,
        lastForgedHeight: 618820,
        rank: 18,
        status: 'active',
        totalVotesReceived: '100000000000',
      },
    },
  },
  empty_account: {
    passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
    summary: {
      publicKey: '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0',
      serverPublicKey: '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0',
      address: 'lskgonvfdxt3m6mm7jaeojrj5fnxx7vwmkxq72v79',
      balance: 0,
      isMigrated: false,
    },
    token: { balance: 0 },
    legacy: {
      address: '12345678900000000000L',
      balance: '9897000000000000',
    },
    sequence: { nonce: '0' },
    dpos: {
      delegate: {},
    },
  },
  delegate_candidate: {
    passphrase: 'right cat soul renew under climb middle maid powder churn cram coconut',
    summary: {
      publicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      serverPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      address: 'lsksckkjs2c8dnu7vhcku825cp62ed6eyxd8pbt6p',
    },
    token: { },
    sequence: { },
    dpos: {
      delegate: { username: 'test' },
    },
  },
  second_passphrase_candidate: {
    passphrase: 'dolphin inhale planet talk insect release maze engine guilt loan attend lawn',
    summary: {
      publicKey: 'ecf6a5cc0b7168c7948ccfaa652cce8a41256bdac1be62eb52f68cde2fb69f2d',
      serverPublicKey: 'ecf6a5cc0b7168c7948ccfaa652cce8a41256bdac1be62eb52f68cde2fb69f2d',
      address: 'lskvagp38bkmuetwazdww84bvkzc2g58u2aodn24z',
    },
    token: { },
    sequence: { },
    dpos: {
      delegate: {},
    },
  },
  send_all_account: {
    passphrase: 'oyster flush inquiry bright leopard gas replace ball hold pudding teach swear',

    summary: {
      publicKey: 'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
      serverPublicKey: 'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
      address: 'lskkx46qy3wkwtfbh4gzbq57tx6dzfexu5yufwh5b',
    },
    token: { },
    sequence: { },
    dpos: {
      delegate: {},
    },
  },
  second_passphrase_account: {
    passphrase: 'awkward service glimpse punch genre calm grow life bullet boil match like',
    summary: {
      publicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
      serverPublicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
      secondPassphrase: 'forest around decrease farm vanish permit hotel clay senior matter endorse domain',
      secondPublicKey: 'ec057d8816b18b83a2baac387eebf8af707f8fb565c963476a0e4533e8481eaf',
      address: 'lskm4qfwau9ajpyx3m59axfederx5ne9qb6grbuy3',
      balance: 1000e8,
    },
    token: { balance: 1000e8 },
    sequence: { },
    dpos: {
      delegate: {},
    },
  },
  without_initialization: {
    passphrase: 'traffic woman skull forest nerve luggage traffic wrestle ensure organ moon century',
    summary: {
      publicKey: 'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494',
      address: 'lskzazqvqytehnucqos7atc5knsp872dhetz9rchn',
      balance: 0,
    },
    token: { balance: 0 },
    sequence: { },
    dpos: {
      delegate: {},
    },
  },
  testnet_guy: {
    passphrase: 'call scene goat common morning immune oxygen reunion skirt amazing current hire',
    summary: {
      address: 'lsk2h73o3bqa4v2u3ehn6c5e787ky38q8wte538mn',
      balance: 200000000,
    },
    token: { balance: 200000000 },
    sequence: { },
    dpos: {
      delegate: {},
    },
  },
  mainnet_delegate: {
    address: '2433857930558702776L',
    summary: {
    },
    token: { },
    sequence: { },
    dpos: {
      delegate: { username: 'tembo' },
    },
  },
};
accounts['any account'] = accounts.genesis;


module.exports = accounts;
