import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import copyToClipboard from 'copy-to-clipboard';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { context } from 'src/modules/blockchainApplication/connection/__fixtures__/requestSummary';
import accounts from '@tests/constants/wallets';
import RequestedTxStatus from '.';
import { encodeTransaction, toTransactionJSON } from '../../utils/encoding';

jest.mock('copy-to-clipboard');
jest.mock('@libs/wcm/hooks/useSession', () => ({
  useSession: () => ({ respond: jest.fn() }),
}));

jest.mock('../../utils/encoding');

describe('TransactionResult RequestedTxStatus', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        module: 'token',
        command: 'transfer',
        fee: BigInt('100000000'),
        nonce: BigInt('1'),
        senderPublicKey: Buffer.from(
          'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
          'hex'
        ),
        signatures: [],
        params: {
          amount: BigInt('1000000000000'),
          data: '',
          recipientAddress: Buffer.from('lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy', 'hex'),
          tokenID: Buffer.from('0000000000000000', 'hex'),
        },
        id: Buffer.from('3d49adde25a12ca34c5893f645ceed395220d1a936e46b9412a2bb77b68e3583', 'hex'),
      },
    },
    title: 'Test title',
    message: 'lorem ipsum',
    t: (t) => t,
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    className: 'test-class',
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    account: accounts.multiSig,
  };
  const transaction = {
    module: 'token',
    command: 'transfer',
    fee: '100000000',
    nonce: '1',
    senderPublicKey: 'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535',
    signatures: [],
    params: {
      amount: '1000000000000',
      data: '',
      recipientAddress: 'lskehj8am9afxdz8arztqajy52acnoubkzvmo9cjy',
      tokenID: '0000000000000000',
    },
  };

  encodeTransaction.mockReturnValue(
    'cf434a889d6c7a064e8de61bb01759a76f585e5ff45a78ba8126ca332601f535'
  );
  toTransactionJSON.mockReturnValue(transaction);

  it('should render properly', async () => {
    render(<RequestedTxStatus {...props} />);
    expect(screen.getByTestId('illustration')).toBeTruthy();
    expect(screen.getByRole('heading').textContent).toBe('Test title');
    expect(screen.getByText('lorem ipsum').className).toBe('transaction-status body-message');
  });

  it('should call correct functions when copy and download buttons are clicked', () => {
    render(
      <ConnectionContext.Provider value={context}>
        <RequestedTxStatus
          {...props}
          status={{
            code: txStatusTypes.multisigSignaturePartialSuccess,
          }}
        />
      </ConnectionContext.Provider>
    );

    fireEvent.click(screen.getByText('Copy and return to application'));
    expect(copyToClipboard).toHaveBeenCalledWith(JSON.stringify(transaction));
  });

  it('should render an error message if the signature was not successful', () => {
    const signatureError = {
      txBroadcastError: null,
      txSignatureError: 'Example error',
      signedTransaction: null,
    };
    const errorProps = {
      ...props,
      status: {
        code: txStatusTypes.signatureError,
      },
      transactions: signatureError,
      message: 'Signature error message',
    };
    render(<RequestedTxStatus {...errorProps} />);
    expect(screen.getByText('Report the error via email')).toBeTruthy();
  });
});
