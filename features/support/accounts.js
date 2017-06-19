const accounts = {
  genesis: {
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
    address: '16313739661670634666L',
  },
  delegate: {
    passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
    address: '537318935439898807L',
    username: 'genesis_17',
  },
  'empty account': {
    passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
    address: '5932438298200837883L',
  },
  'delegate candidate': {
    passphrase: 'right cat soul renew under climb middle maid powder churn cram coconut',
    address: '544792633152563672L',
    username: 'test',
  },
  'second passphrase candidate': {
    passphrase: 'dolphin inhale planet talk insect release maze engine guilt loan attend lawn',
    address: '4264113712245538326L',
  },
  'send all account': {
    passphrase: 'oyster flush inquiry bright leopard gas replace ball hold pudding teach swear',
    address: '16422276087748907680L',
  },
  'second passphrase account': {
    // TODO: register the second passphrase in ./e2e-test-setup.sh
    passphrase: 'awkward service glimpse punch genre calm grow life bullet boil match like',
    secondPassphrase: 'forest around decrease farm vanish permit hotel clay senior matter endorse domain',
    address: '1155682438012955434L',
  },
};
accounts['any account'] = accounts.genesis;


module.exports = accounts;
