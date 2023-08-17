/* eslint-disable max-lines */
import { cryptography, transactions } from '@liskhq/lisk-client';
import { fromTransactionJSON, toTransactionJSON } from 'src/modules/transaction/utils';
import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
import { getParamsSchema } from 'src/modules/transaction/hooks/useTransactionFee/utils';

export const getState = () => ({
  wallet: {
    passphrase: 'test',
    info: {
      LSK: {
        summary: {
          address: 'lskwnxvy7wmgbt8y3mh7fcs4u4cwj7f48eh58kga9',
          publicKey: '205688492bc52ddabfdc10fa7728b8bcb5942ad17c68ab5c20e96153fd1ac657',
          privateKey:
            'ae7522b1fd7a24886b1396b392368fe6c9b2e0e40cf86ecf193e46babe3cbe8a0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
        },
        sequence: { nonce: 0 },
      },
    },
    loginType: 0,
  },
  network: {
    status: { online: true },
    name: 'Mainnet',
    networks: {
      LSK: {
        serviceUrl: 'http://localhost:4000',
        networkIdentifier: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        ...moduleCommandSchemas,
      },
    },
  },
  transactions: {
    filters: {},
    signedTransaction: {},
  },
  settings: {},
  token: {
    active: 'LSK',
    list: {
      LSK: true,
    },
  },
});

export const transformedAccountTransaction = {
  moduleCommand: 'pos:stakeValidator',
  id: 'ad0e0acbe8a3ece3087c8362149ca39c470e565d268df32e57de5d3fe2e1ea5c',
  fee: '142000n',
  nonce: '2n',
  signatures: [
    '4bfc0ab5e1b3c3fb1ca7362acc917775ce6345f26a261d592d83c62ad156e90221269a3b423516c2b84c1ebdd285d3bf83be688f5a158c1daf7245fecea0350a',
  ],
  sender: {
    address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6',
    publicKey: '205688492bc52ddabfdc10fa7728b8bcb5942ad17c68ab5c20e96153fd1ac657',
  },
};

export const newTransaction = {
  pending: [],
  confirmed: [],
  count: null,
  filters: {
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    message: '',
  },
  signedTransaction: {
    id: 1,
    params: {
      amount: 112300000,
    },
    fee: 0.00012451,
  },
  txSignatureError: null,
  txBroadcastError: null,
};

export const signFixtureTransaction = ({
  transactionJSON,
  privateKey = wallets.genesis.privateKey,
  chainID = '00000000',
  paramsSchema = {},
}) => {
  chainID = Buffer.isBuffer(chainID) ? chainID : Buffer.from(chainID, 'hex');
  privateKey = Buffer.isBuffer(privateKey) ? privateKey : Buffer.from(privateKey, 'hex');
  paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);
  const transactionObject = fromTransactionJSON(transactionJSON, paramsSchema);
  transactionJSON = toTransactionJSON(transactionObject, paramsSchema);

  return transactions.signTransactionWithPrivateKey(
    transactionObject,
    chainID,
    privateKey,
    paramsSchema
  );
};

export const getTransactionObject = (transactionJSON) => {
  const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);
  return fromTransactionJSON(transactionJSON, paramsSchema);
};

export const tokenTransfer = {
  module: 'token',
  command: 'transfer',
  nonce: '7339636738092037709',
  fee: '9886722176580209175',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    tokenID: '1e362cc6d65bdbb1',
    amount: '9140968487542404274',
    recipientAddress: 'lskr8xo6fkzg2m3fhgsofbnfozcn7nnsdgbma6e42',
    data: 'survey twist collect recipe morning reunion crop loyal celery',
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const tokenTransferCrossChain = {
  module: 'token',
  command: 'transferCrossChain',
  nonce: '1179169655000941929',
  fee: '17352262930646337716',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    tokenID: '5d0c516a0237dacc',
    amount: '14974766695292105195',
    receivingChainID: '2a00807e',
    recipientAddress: 'lsk5zkdr7cqjjcka78unjoeb4gjsdxhdfdprk42qb',
    data: 'language picnic embark day table spoon garage cook magic trigger',
    messageFee: '1110588655856176923',
    messageFeeTokenID: '90db54e472205ad0',
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const multiSignatureRegistration = {
  module: 'auth',
  command: 'registerMultisignature',
  nonce: '13606773953005161904',
  fee: '8642574916279552169',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    numberOfSignatures: 50,
    mandatoryKeys: [
      '45c83ad35eccd8787f2617ed071e3584501e6fd50fd306f393bae1bc8d23d97d',
      '2da1527d0909f632d11636e233b779e7ef305a72e9a06edc06cfaa4e2e8707e4',
      '8ba9aff745b79981eb6f73dac06bacf1b7062747fe71fb34813cd7ba3779efc3',
      'aabd12ea1f550470ca89fa584040defe691e4c79e3b7f6f0b2a0ac373fc61529',
      '9c51706338c79250835f729fa074dfb42abde59b036dc5dd2832c2b3006176d8',
      'f52215d6687c600597a2e34939a851cd4368f1e96e73602d1aa4c3c30bec8bff',
      'd940c312c9c9180f92a7ea6524ec55068641cbe35c6b1aa7f50873f584998ff4',
      'c111a3c2ccc0a51631308b68936d61d24c4670e20cf9301cba34450b35e35364',
      '030e6c7fcbae3ad8482e62ddca3688b7a8aae9d7ca7660528a3594e7fd2efe1a',
      '2e9171e0cea58bf4ed573e789353ce88f269afa61430d6d2e92b70a7f91f83ef',
      '2f275d0c85d10ec85b28116d6f37f29cf3c907bd85d895b43bf0eb264db86918',
      'efbd625d0cb84825c0d132d80c1c0ddf8cf10265d18429a7addcde863e43378a',
      'dc1ab81532c40e84bee49e8dbf40c407852cadc0a296a259627c8dc905a6f915',
    ],
    optionalKeys: [
      'b84d668a054d46483a86d1e9605bab869c617286cc732384d2cfe94db49fa0f1',
      '24e2cdd1203a264b604a1818936469947875ce32eccd2a87fa8dc4b3e917eae7',
      '4ab3a103af41b7773a44f5096e48fc3e43646e2846642de7040b4043e1e319f2',
      '1fa455f906b3896993826c189e00b8968cc2d6814ab3c1eb1de94be57772616c',
      '0c768ab5cb01483ef0602ac7e3233a3a27ff652bfcde7c2d08146020837457f5',
      '4af5ea1c084d072bc63137b79f83015c2c173e68029ce78a8fd074777e9d6c16',
      '2995326d428cf2f47abc5968032541b583a7fa4e5aebe9126e937557e147adbb',
    ],
    signatures: [
      'fc64c70fae22047b49d88fb88097dfa3c3c3180d4bf264aa1ef0cc33bfe9a8c0caa1ef5213befd39520cad1de7c6f6d45915b7dccb39f92695db3aed34df0ba7',
      '34a9928249d735d0a7b30808fa5935029c7e8103d454fba09266f452d01aee8671c1d78edd86ed0b3089ce37ba5160b2be61090e192fdaf2fc8d690c4309c9c8',
      '90dfcb1e362ddd86f335f95932938e3a4766bcc101b666167d32127ce6b3bca6b0a5f9313b3957b58cc9cc2085971eb2fcbfcb526f1d69302caf0426b459fb53',
      'bb94c37ae1064bb24eb11be99bef1769790377f708e54728ca066ff762ee918f1b0d9b5113566e251a9dd246512136c9a4f1f792b59d663ec2abeabcf71687f9',
      '7aecd952601294b78b1a3cd59bb54102147ec2f6eba255007b9c564024f03a148db4e85c34a89a456482848367b8286a6fe6f789b0b6cbaa99c2498b8ac4acad',
      '62386b601220f46897c7df759f25561899679b5ce64972fea21b15189a7d0ed728e4fbd36c1991d0a97af3d97720d550e87e1d0d637bde894b60b2ec9a354db3',
      '9facd36fbf79788ada2bf08fc05eafc3be7403af5c9acd789717580ad19757ddc0997a28594ea45fb92e48e15803284c1e70454c10a81cacac8373883ba95e2b',
      'c4dfddec3a08620620712102a350d87092e84d074688838ff87bc5e986a8e4f3089285e61a03606a93a66252d7cd18660189d24bfea3da4c4556071e49c54d50',
      '6d3fc6a26416d8c9521ffd596490cb24714b27d9026fbc08f336962e11572005b8530b03a541c97fd0c26c9227f4fc34f8c6da5e698807fb58e4ebec88c6fd6a',
      'ac4435b81c0b6a7008a59ea1f346cf2919c9fec6574981575b12829036ce764947783ec6342a146e869e0a80d7ea97bb2bddfa71f0e870155e80373fb2349250',
      '318886318483d09b3e6ee8e1bd4f868834e0dc28cce754c5e2a054834c01f20f45f3f45638582b0aee209deab964b953e3d06a60a2455c07b98d0dee4ac4c25d',
      '340a69799d977c8b962e468724a4b64a6abf3ee6a33cdadb8d37194448561ea49f5496b497c6556f1db5d1b0f7b6d382355cdaa76b28e4b6c6e2555f84f5a9f8',
      '7284832bdaee0a5d2ae7d288b11e04961142993b53918774f7d2e37fb8149e57352e49203e7df63229504b02e8826d4274e8877edcf75b9017da6a392447bdd6',
      '778914f7ba91deefd6849c203d64ef798eb6133ee4f3b3be8a2a820fa2d5a6509ecf4dedcae92ee88d22b82e5aab754132ede13d74c776dbf70d2cca2b76aa68',
      'c14d41928279562b68fb9967bfaeca60b0b2762efbeeeae320e0841637d89739c56543360c08cbe1ec2ed9a4377e6791eaad2e73d1fcee8c40f744e397a3fb77',
      '3f4f496bbd2b086a1d7079ac7930eab6e7369213f96fba4e93d12e0fd1296452046e0b9f368a17d7186df13c0cd10db2ba3a6c047c47e14ef5b8ec4b2363b5b1',
      'f0765657c5268a39893dc8b4e3c4999a4c1af93c3b49d88a1e7dbe491fbbbd6232f5f7d55b3b8053e5fe7e2146c779b8b8f49ff700abd593e3ec75febab3c020',
      'b4d73e3fa604847dfcd2f34dcca0fb28923a107fc056dd9e193fe73329002100ac582067373ee4a86bf4e39e987d3c66807b8eeddd1eab637e7e5e2433f9b35f',
      '0d787e5b6ef89499df9d7e680ef8b10f1d587c276d76665647e02b33c70547893290fe329cec61b42806f4f8e2b16cc91fe1176a988836062b60cb1ca3e9aaa8',
      'a7a63aae0c2e5f9b5aec8e34ed83299b660f74ea8d01345dff8822f78395f95ab0f20eec8b5a540c81c41bb77bed2b7219190b010e586bc278c9f1f726ad7658',
    ],
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posRegisterValidator = {
  module: 'pos',
  command: 'registerValidator',
  nonce: '13082039944676438689',
  fee: '2056949940631790070',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    name: 'scatter',
    blsKey:
      'ed6299dc6b4fe59f20bfe4adf4beaac25c6affcdee74499798364edd392b1518d738be3feecd19d1d4b0e16ad739d549',
    proofOfPossession:
      '0eac4a26270a8f711a8f07dc9c5a9d48fd58d852e43004cb00d0f1d5ebffd79e24189c987656f582d877f197d2759891e6d6bfe9000a20f7134e5456d4148abf842097ad47c43403a2d65590b050ffe59b885748d3f0ee11ebb6801106dddb3c',
    generatorKey: '792c0d36fda5ca8470bcb9ea08dfc428ef0e0554114618d4c5a726f0ab9e02d6',
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posStake = {
  module: 'pos',
  command: 'stake',
  nonce: '2471490776850999829',
  fee: '1604488025112898306',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    stakes: [
      {
        validatorAddress: 'lskra6k42jaxwd9t9zqeqvpak59rjjvbzwgb9uq7p',
        amount: '17327853400584947023',
      },
      {
        validatorAddress: 'lskfx9fxra5f2snqazmkct9wj2ebd2xtxwbuv8u2h',
        amount: '9256453989320740233',
      },
      {
        validatorAddress: 'lskqhfa6kvyzve9jd9ksrmfq76f9hs2wc8rs4ttby',
        amount: '3016875510246164037',
      },
      {
        validatorAddress: 'lsk53pjmwwvpd35tce76oj7s66b84d4rpw78kjrqc',
        amount: '12577337036362243932',
      },
      {
        validatorAddress: 'lskcv4y3cpcv5zp6szzmgzzu84mmxdxwrx3jze6ej',
        amount: '9803057464568916176',
      },
      {
        validatorAddress: 'lsk37tf9gcfev27z6nh34dfokp6nsvfqfehdyrdah',
        amount: '18376337929163665175',
      },
    ],
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posUnlock = {
  module: 'pos',
  command: 'unlock',
  nonce: '14181422212368108423',
  fee: '14094737484021319723',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {},
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posClaimRewards = {
  module: 'pos',
  command: 'claimRewards',
  nonce: '6938434062574405918',
  fee: '11384456842197192825',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {},
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posChangeCommission = {
  module: 'pos',
  command: 'changeCommission',
  nonce: '11284145876061414261',
  fee: '27968742994614166',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    newCommission: 8739,
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const posReportMisbehavior = {
  module: 'pos',
  command: 'reportMisbehavior',
  nonce: '1571657393574912547',
  fee: '13872146210731066540',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    header1:
      'd1e392ee99b9614d050a27987ad5e3845802712af945466fd5e3df23100e909d7b5424bc75ba881a39e2bd1b18b5cff2b7eeb7f9e114daecf418449b',
    header2:
      'f8073eb95f6dfe26e8e1b0d7ffacc8d2e8143cdc5954f8c1a3e48fe4eb910488466ebf7c940c308af61d1281ec8819045e86d47735ab403f2462f748',
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};

export const legacyReclaimLSK = {
  module: 'legacy',
  command: 'reclaimLSK',
  nonce: '2984799992651295337',
  fee: '10326756795033427101',
  senderPublicKey: 'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
  params: {
    amount: '4079550703400926419',
  },
  signatures: [cryptography.utils.getRandomBytes(64).toString('hex')],
  id: '',
};
