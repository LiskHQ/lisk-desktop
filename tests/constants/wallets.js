const wallets = {
  genesis: {
    passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
    summary: {
      publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      serverPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
      address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      balance: '9897000000000000',
      isMigrated: true,
      isMultisignature: false,
      privateKey: 'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    },
    token: { balance: '9897000000000000' },
    sequence: { nonce: '1' },
    keys: { numberOfSignatures: 0, mandatoryKeys: [], optionalKeys: [] },
    dpos: {
      delegate: {},
      sentVotes: [],
    },
  },
  delegate: {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    summary: {
      publicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
      serverPublicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
      address: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
      balance: 1000e8,
      isDelegate: true,
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
  empty_wallet: {
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
      sentVotes: [],
    },
  },
  delegate_candidate: {
    passphrase: 'right cat soul renew under climb middle maid powder churn cram coconut',
    summary: {
      publicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      serverPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
      address: 'lsksckkjs2c8dnu7vhcku825cp62ed6eyxd8pbt6p',
      isDelegate: false,
    },
    token: { },
    sequence: { },
    dpos: {
      delegate: { username: 'test' },
    },
  },
  multiSig_candidate: {
    passphrase: 'approve tribe main deposit luxury obtain knock problem pulse claw social select',
    summary: {
      publicKey: 'a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103',
      serverPublicKey: 'a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103',
      address: 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz',
    },
    token: {},
    sequence: { nonce: 1 },
    dpos: {
      delegate: {},
      sentVotes: [],
    },
  },
  multiSig: {
    passphrase: 'approve tribe main deposit luxury obtain knock problem pulse claw social select',
    summary: {
      publicKey: 'a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103',
      serverPublicKey: 'a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103',
      address: 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz',
      balance: '9897000000000000',
      isMigrated: true,
      isMultisignature: true,
      privateKey: 'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    },
    token: { balance: '9897000000000000' },
    sequence: { nonce: '1' },
    keys: {
      numberOfSignatures: 2,
      mandatoryKeys: ['35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f'],
      optionalKeys: ['0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0'],
    },
    dpos: {
      delegate: {},
      sentVotes: [],
    },
  },
  send_all_wallet: {
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
      sentVotes: [],
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
      sentVotes: [],
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
      sentVotes: [],
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
  non_migrated: {
    summary: {
      address: 'lsk8dwx2xdagos9v7vq6h2qnv4jnbjc95hxs7nckc',
      legacyAddress: '15075513162459295358L',
      balance: '100000000',
      username: '',
      publicKey: '6e0291140a28148267e30ac69b5e6965680190dc7de13b0a859bda556c9f0f86',
      isMigrated: false,
      isDelegate: false,
      isMultisignature: false,
    },
    token: {
      balance: '100000000',
    },
    sequence: {
      nonce: '0',
    },
    keys: {
      numberOfSignatures: 0,
      mandatoryKeys: [],
      optionalKeys: [],
    },
    dpos: {
      delegate: {
        username: '',
        consecutiveMissedBlocks: 0,
        lastForgedHeight: 0,
        isBanned: false,
        totalVotesReceived: '0',
      },
    },
    legacy: {
      address: '15075513162459295358L',
      balance: '13600000000',
    },
  },
  secondPass: {
    secondPass: 'fall audit ankle myself cook gospel common matrix limit load frost stay',
    passphrase: 'steak avoid couple fog ability chalk jacket electric rifle fuel tuition van',
    summary: {
      address: 'lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp',
      balance: '5835970000',
      publicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
      isMultisignature: true,
    },
    token: {
      balance: '5835970000',
    },
    sequence: {
      nonce: '19',
    },
    keys: {
      numberOfSignatures: 2,
      mandatoryKeys: [
        '3182b14f4679fcecdfcba89045cdcc770d9acaa6abcfaebe52a40ddb6436b6cc',
        '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
      ],
      optionalKeys: [],
    },
    dpos: { delegate: {} },
  },
  wallet2P: {
    passphrase: 'steak avoid couple fog ability chalk jacket electric rifle fuel tuition van',
    summary: {
      address: 'lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp',
      balance: '5834556000',
      publicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
      isMultisignature: true,
    },
    token: { balance: '5834556000' },
    sequence: { nonce: '21' },
    keys: {
      numberOfSignatures: 2,
      mandatoryKeys: [
        '3182b14f4679fcecdfcba89045cdcc770d9acaa6abcfaebe52a40ddb6436b6cc',
        '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
      ],
      optionalKeys: [],
      members: [
        {
          address: 'lskadd9hd2kvxusbkqd4mroeeeds59m68v24fsctb',
          publicKey: '3182b14f4679fcecdfcba89045cdcc770d9acaa6abcfaebe52a40ddb6436b6cc',
          isMandatory: true,
        },
        {
          address: 'lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp',
          publicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
          isMandatory: true,
        },
      ],
      memberships: [
        {
          address: 'lskqsh6v8k2d24japgz69t8sbftb932uvwayqwdz5',
          publicKey: '4329462a6023c7090c3267c86f8dee21ed249fbb3871744422dbe25f3a880365',
          username: '!@$&',
        },
      ],
    },
    dpos: {
      delegate: {},
      unlocking: [],
    },
  },
  mainnet_guy: {
    passphrase: 'pass umbrella hold deny stumble slab trade fall test noodle royal pluck',
    summary: {
      address: 'lskaror3zjhrg85edkfemyg7aoq4cq6jqycnxgkr9',
      balance: '0',
      isDelegate: false,
      isMigrated: false,
      isMultisignature: false,
      legacyAddress: '13537424230540679628L',
      publicKey: 'e3e86b862d74d55fe05eff9170932a7d3b103d31e5e63c2dc294db7bd0ac23a9',
    },
    token: { balance: '0' },
    legacy: {
      address: '13537424230540679628L',
      balance: '12100000',
    },
    dpos: {
      delegate: {
        username: '',
        consecutiveMissedBlocks: 0,
        lastForgedHeight: 0,
        isBanned: false,
        totalVotesReceived: '0',
      },
    },
  },
};

export default wallets;
