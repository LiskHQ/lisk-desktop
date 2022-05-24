const savedAccounts = [
  {
    crypto: {
      kdf: 'argon2id',
      kdfparams: {
        parallelism: 4,
        iterations: 1,
        memory: 2048,
        salt: '30fc0301d36fcdc7bd8204e19a0043fc',
      },
      cipher: 'aes-256-gcm',
      cipherparams: {
        iv: '281d21872c2d303e59850ce4',
        tag: '2458479edf6aea5c748021ae296e467d',
      },
      ciphertext: '44fdb2b132d353a5c65f04e5e3afdd531f63abc45444ffd4cdbc7dedc45f899bf5b7478947d57319ea8c620e13480def8a518cc05e46bdddc8ef7c8cfc21a3bd',
    },
    metadata: {
      name: 'my lisk account',
      description: 'ed25519 key pair',
      pubkey: 'c6bae83af23540096ac58d5121b00f33be6f02f05df785766725acdd5d48be9d',
      path: "m/44'/134'/0'",
      address: 'lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e',
      creationTime: '',
      derivedFromUUID: 'fa3e4ceb-10dc-41ad-810e-17bf51ed93aa',
    },
    uuid: 'ef52c117-d7cc-4246-bc9d-4dd506bef82f',
    version: 1,
  },
];

export default savedAccounts;
