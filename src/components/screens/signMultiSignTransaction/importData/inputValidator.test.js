import testTx from './testTx.json';
import testRegisterMultisgn from './testRegisterMultisgn.json';
import inputValidator from './inputValidator';

describe.skip('Input multisignature transaction validator', () => {
  it('Should return true on correct tx', () => {
    expect(inputValidator(testRegisterMultisgn)).toBe(true);
    expect(inputValidator(testTx)).toBe(true);
  });

  it('Should return true when signatures are empty', () => {
    const customTx = {
      ...testTx,
      signatures: [],
    };
    expect(inputValidator(customTx)).toBe(true);
  });

  it('Should return when lsTrackingId, nonce, fee, senderPublicKey, type are invalid', () => {
    let customTx = {
      ...testTx,
      lsTrackingId: undefined,
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      nonce: undefined,
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      fee: undefined,
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      senderPublicKey: undefined,
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      type: 5,
    };
    expect(inputValidator(customTx)).toBe(false);
  });

  it('Should return false when signatures are invalid', () => {
    let customTx = {
      ...testTx,
      signatures: [
        {
          publicKey: 'a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d',
          accountId: '8195226425328336181L',
          signature: 'signature',
        },
      ],
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      signatures: [
        {
          signature: 'signature',
          accountRole: 'mandatory',
        },
      ],
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      signatures: 'signatures',
    };
    expect(inputValidator(customTx)).toBe(false);
  });

  it('Should return false when asset is invalid', () => {
    let customTx = {
      ...testTx,
      asset: {
        amount: 100000000,
        recipientId: '5059876081639179984L',
        data: '',
        mandatoryKeys: ['a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d'],
        optionalKeys: ['0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '2ce9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '3rfe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
        numberOfSignatures: 4,
      },
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      asset: {
        amount: '100000000',
        data: '',
        mandatoryKeys: ['a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d'],
        optionalKeys: ['0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '2ce9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '3rfe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
        numberOfSignatures: 4,
      },
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      asset: {
        amount: '100000000',
        recipientId: '5059876081639179984L',
        data: '',
        mandatoryKeys: ['a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d'],
        optionalKeys: ['0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '2ce9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '3rfe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
        numberOfSignatures: 4,
      },
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      asset: {
        amount: '100000000',
        recipientId: '5059876081639179984L',
        data: '',
        mandatoryKeys: ['a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d'],
        optionalKeys: 'optionalKeys',
        numberOfSignatures: 4,
      },
    };
    expect(inputValidator(customTx)).toBe(false);
    customTx = {
      ...testTx,
      asset: {
        amount: '100000000',
        recipientId: '5059876081639179984L',
        data: '',
        mandatoryKeys: ['a0d9fc560dc4599ca3cdbe9fe3307f2044f76c454e739300b85ae2b1e4335d6111186c3f71360f535a0f89413a18d53aa57b74f5afbfd4bb923d32b8e9c0640d'],
        optionalKeys: ['0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '2ce9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '3rfe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
      },
    };
    expect(inputValidator(customTx)).toBe(false);
  });
});
