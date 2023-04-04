import { getTransactionStatus } from './statusConfig';
import { txStatusTypes } from './txStatus';

describe('Transaction signature status', () => {
  const partiallySignedTransaction = {
    module: 'auth',
    command: 'registerMultisignature',
    nonce: '1',
    fee: '340000',
    senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
    params: {
      mandatoryKeys: [
        'a3f96c50d0446220ef2f98240898515cbba8155730679ca35326d98dcfb680f0',
        'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
      ],
      optionalKeys: [],
      numberOfSignatures: 2,
      signatures: [
        Buffer.alloc(64),
        Buffer.from(
          'dac33aedad70b2e1329c3f0b241769bcf5ac5ec2494081910e54c2107a61ec2a56d1d1ac6c5814416288911fe87906b35ec0b9fd77df44c698857d56053af504'
        ),
      ],
    },
    signatures: [''],
    id: '',
  };

  const signedTransaction = {
    module: 'auth',
    command: 'registerMultisignature',
    nonce: '1n',
    fee: '340000n',
    senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
    params: {
      mandatoryKeys: [
        'a3f96c50d0446220ef2f98240898515cbba8155730679ca35326d98dcfb680f0',
        'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
      ],
      optionalKeys: [],
      numberOfSignatures: 2,
      signatures: [
        Buffer.from(
          'ed058b6c067f9f5a55a83c38e02975931214de6f86aeb15179fb71f2f751412a82e5bad8bd0d5e25f493c445db978a687ca097c190d1e6042043133880dbdc0f'
        ),
        Buffer.from(
          'dac33aedad70b2e1329c3f0b241769bcf5ac5ec2494081910e54c2107a61ec2a56d1d1ac6c5814416288911fe87906b35ec0b9fd77df44c698857d56053af504'
        ),
      ],
    },
    signatures: [
      'ebbc3fdc3eeae5de33f7d0723d9d0698c2da595094e064c25aad64d20ef2ad815d20a703bc043d5703be8c3b229aa772ac7813d79f65bc88a7413f7ad4837e08',
    ],
    id: '1e2a1f670f5bf3a2d23c363e4dcbc3ab66588be601f63af74b5ac7facfb08ea5',
  };

  it('should return transaction status for partially signed transaction', () => {
    const account = {};
    const transactions = {
      txSignatureError: null,
      signedTransaction: partiallySignedTransaction,
    };
    const isMultisignature = false;
    const status = getTransactionStatus(account, transactions, { isMultisignature });
    expect(status).toEqual({ code: txStatusTypes.multisigSignaturePartialSuccess });
  });

  it('should return transaction status for fully signed transaction', () => {
    const account = {};
    const transactions = {
      txSignatureError: null,
      signedTransaction,
    };
    const isMultisignature = true;
    const status = getTransactionStatus(account, transactions, {
      isMultisignature,
      canSenderSignTx: true,
    });
    expect(status).toEqual({ code: txStatusTypes.multisigSignatureSuccess });
  });

  it('should return transaction status for fully signed transaction when its not multisignature ', () => {
    const account = {};
    const transactions = {
      txSignatureError: null,
      signedTransaction,
    };
    const isMultisignature = false;
    const status = getTransactionStatus(account, transactions, {
      isMultisignature,
      canSenderSignTx: true,
    });
    expect(status).toEqual({ code: txStatusTypes.signatureSuccess });
  });
});
