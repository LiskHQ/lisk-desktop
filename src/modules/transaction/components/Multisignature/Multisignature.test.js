import React from 'react';
import { mount } from 'enzyme';
import copyToClipboard from 'copy-to-clipboard';
import * as txUtils from '@transaction/utils/transaction';
import routes from 'src/routes/routes';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import accounts from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import Multisignature, { FullySignedActions, PartiallySignedActions } from '.';
import { toTransactionJSON } from '../../utils';

jest.mock('copy-to-clipboard');

describe('TransactionResult Multisignature', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        id: Buffer.from('94aa29aa94c55323c3e4b8a1409b879f1766477a84bb028143ac10aa7f44b217', 'hex'),
        module: 'token',
        command: 'transfer',
        nonce: BigInt('7339636738092037709'),
        fee: BigInt('9886722176580209175'),
        senderPublicKey: Buffer.from(
          'bfbef2a36e17ca75b66fd56adea8dd04ed234cd4188aca42fc8a7299d8eaadd8',
          'hex'
        ),
        params: {
          tokenID: Buffer.from('0400000100000000', 'hex'),
          amount: BigInt('9140968487542404274'),
          recipientAddress: Buffer.from('lskr8xo6fkzg2m3fhgsofbnfozcn7nnsdgbma6e42', 'hex'),
          data: 'survey twist collect recipe morning reunion crop loyal celery',
        },
        signatures: [],
      },
    },
    title: 'Test title',
    message: 'lorem ipsum',
    t: (t) => t,
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    className: 'test-class',
    history: { push: jest.fn() },
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    account: accounts.multiSig,
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  };

  it('should render properly', () => {
    const wrapper = mount(<Multisignature {...props} />);
    expect(wrapper.find('.test-class')).toExist();
    expect(wrapper.find('.result-box-header')).toHaveText(props.title);
    expect(wrapper.find('.body-message')).toHaveText(props.message);
  });

  it('should navigate to wallet', () => {
    const wrapper = mount(
      <Multisignature
        {...props}
        status={{
          code: txStatusTypes.broadcastSuccess,
        }}
      />
    );
    wrapper.find('.back-to-wallet-button').at(0).simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.wallet.path);
  });

  it('should call correct functions when copy and download buttons are clicked', () => {
    const downloadJSONSpy = jest.spyOn(txUtils, 'downloadJSON');
    const wrapper = mount(
      <Multisignature
        {...props}
        status={{
          code: txStatusTypes.multisigSignaturePartialSuccess,
        }}
      />
    );
    const transactionJSON = toTransactionJSON(
      props.transactions.signedTransaction,
      props.moduleCommandSchemas['token:transfer']
    );
    expect(wrapper.find(FullySignedActions)).not.toExist();
    expect(wrapper.find(PartiallySignedActions)).toExist();

    wrapper.find('.download-button').at(0).simulate('click');
    expect(downloadJSONSpy).toHaveBeenCalledWith(
      transactionJSON,
      'sign-multisignature-request-94aa29aa94c55323c3e4b8a1409b879f1766477a84bb028143ac10aa7f44b217'
    );
    wrapper.find('.copy-button').at(0).simulate('click');
    expect(copyToClipboard).toHaveBeenCalledWith(JSON.stringify(transactionJSON));
  });

  it('should props.transactionBroadcasted', () => {
    const wrapper = mount(
      <Multisignature
        {...props}
        status={{
          code: txStatusTypes.multisigSignatureSuccess,
        }}
      />
    );
    expect(wrapper.find(FullySignedActions)).toExist();
    expect(wrapper.find(PartiallySignedActions)).not.toExist();
    wrapper.find('.send-button').at(0).simulate('click');
    expect(props.transactionBroadcasted).toHaveBeenCalledWith(
      props.transactions.signedTransaction,
      props.moduleCommandSchemas
    );
  });
});
