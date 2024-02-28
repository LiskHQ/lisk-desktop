import {
  signMessageWithPrivateKey,
  signClaimMessageWithPrivateKey,
} from './signMessageWithPrivateKey';

const result = `
  -----BEGIN LISK SIGNED MESSAGE-----
  -----MESSAGE-----
  X3CUgCGzyn43DTAbUKnTMDzcGWMooJT2hPSZinjfN1QUgVNYYfeoJ5zg6i4Nc6CZnZqb1vBvsAT\n-----PUBLIC KEY-----\n5bb1138c01b7762318f5e8a8799573077caadb1c7333a5c631773a2ade4bbdb5\n-----SIGNATURE-----\ne9c8606d4a2230ef28da0f2429c01ebf794d7b49cd6851307ea917e7b8b283cdad35dc4519681118ebc0a37e4e240c914e38089b092d68e86733911af5963708
  -----END LISK SIGNED MESSAGE-----
`;
const claimBuffer = [
  21, 229, 70, 230, 223, 122, 23, 150, 12, 0, 200, 12, 180, 42, 57, 104, 202, 0, 79, 45, 142, 253,
  4, 76, 178, 187, 20, 232, 59, 161, 115, 176, 47, 196, 196, 10, 212, 123, 14, 202, 114, 47, 48, 34,
  213, 216, 40, 116, 250, 210, 90, 124, 2, 100, 216, 163, 30, 32, 241, 119, 65, 164, 230, 2,
];
jest.mock('@liskhq/lisk-client', () => ({
  cryptography: {
    ed: {
      signAndPrintMessage: jest.fn(() => result),
    },
  },
}));
jest.mock('tweetnacl', () => ({
  sign: {
    detached: jest.fn(() => claimBuffer),
  },
}));

describe('SignMessageWithPrivateKey', () => {
  it('returns signed message', () => {
    const message = 'X3CUgCGzyn43DTAbUKnTMDzcGWMooJT2hPSZinjfN1QUgVNYYfeoJ5zg6i4Nc6CZnZqb1vBvsAT';
    const privateKey =
      'd92f8ffd3046fa9de33c21cef7af6f1315e289003c19f9b23ce6d499c8641d4e0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
    expect(signMessageWithPrivateKey({ message, privateKey })).toBe(result);
  });
});

describe('SignClaimMessageWithPrivateKey', () => {
  it('returns signed claim message', () => {
    const message =
      '0xe4dbb94d0f19e47b0cff8206bebc1fcf8d892325ab851e1a5bdab954711d926e000000000000000000';
    const privateKey =
      'd92f8ffd3046fa9de3Ž3c21cef7af6f1315e289003c19f9b23ce6d499c8641d4e0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184';
    const claimResult =
      '15e546e6df7a17960c00c80cb42a3968ca004f2d8efd044cb2bb14e83ba173b02fc4c40ad47b0eca722f3022d5d82874fad25a7c0264d8a31e20f17741a4e602';

    expect(signClaimMessageWithPrivateKey({ message, privateKey }).toString('hex')).toBe(
      claimResult
    );
  });
});
