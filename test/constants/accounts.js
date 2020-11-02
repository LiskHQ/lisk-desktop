const accounts = {
  genesis: {
    passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
    publicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    serverPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    address: '5059876081639179984L',
    balance: '9897000000000000',
    nonce: '1',
  },
  delegate: {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    publicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
    serverPublicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
    address: '537318935439898807L',
    username: 'genesis_17',
    balance: 1000e8,
  },
  empty_account: {
    passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
    publicKey: '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0',
    serverPublicKey: '197cf311f678406bc72a8edfdc3dffe6f59f49c4550a860e4b68fb20382211d0',
    address: '5932438298200837883L',
    balance: 0,
  },
  delegate_candidate: {
    passphrase: 'right cat soul renew under climb middle maid powder churn cram coconut',
    publicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
    serverPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
    address: '544792633152563672L',
    username: 'test',
  },
  multiSig_candidate: {
    passphrase: 'approve tribe main deposit luxury obtain knock problem pulse claw social select',
    publicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
    serverPublicKey: '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
    address: '1941002779612196826L',
  },
  second_passphrase_candidate: {
    passphrase: 'dolphin inhale planet talk insect release maze engine guilt loan attend lawn',
    publicKey: 'ecf6a5cc0b7168c7948ccfaa652cce8a41256bdac1be62eb52f68cde2fb69f2d',
    serverPublicKey: 'ecf6a5cc0b7168c7948ccfaa652cce8a41256bdac1be62eb52f68cde2fb69f2d',
    address: '4264113712245538326L',
  },
  send_all_account: {
    passphrase: 'oyster flush inquiry bright leopard gas replace ball hold pudding teach swear',
    publicKey: 'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
    serverPublicKey: 'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
    address: '16422276087748907680L',
  },
  second_passphrase_account: {
    passphrase: 'awkward service glimpse punch genre calm grow life bullet boil match like',
    publicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
    serverPublicKey: 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
    secondPassphrase: 'forest around decrease farm vanish permit hotel clay senior matter endorse domain',
    secondPublicKey: 'ec057d8816b18b83a2baac387eebf8af707f8fb565c963476a0e4533e8481eaf',
    address: '1155682438012955434L',
    balance: 1000e8,
  },
  without_initialization: {
    passphrase: 'traffic woman skull forest nerve luggage traffic wrestle ensure organ moon century',
    publicKey: 'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494',
    address: '94495548317450502L',
    balance: 0,
  },
  testnet_guy: {
    passphrase: 'call scene goat common morning immune oxygen reunion skirt amazing current hire',
    address: '9819477579273755847L',
    balance: 200000000,
  },
  mainnet_delegate: {
    address: '2433857930558702776L',
    username: 'tembo',
  },
};
accounts['any account'] = accounts.genesis;


module.exports = accounts;
