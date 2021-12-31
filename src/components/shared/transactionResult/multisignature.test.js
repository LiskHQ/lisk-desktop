import React from 'react';
import { mount } from 'enzyme';
import copyToClipboard from 'copy-to-clipboard';
import * as txUtils from '@utils/transaction';
import { routes, txStatusTypes } from '@constants';
import Multisignature, { FullySignedActions, PartiallySignedActions } from './multisignature';
import accounts from '../../../../test/constants/accounts';

jest.mock('copy-to-clipboard');

describe('TransactionResult Multisignature', () => {
  const props = {
    transactions: {
      txBroadcastError: null,
      txSignatureError: null,
      signedTransaction: {
        id: 1,
        senderPublicKey: accounts.multiSig.summary.publicKey,
        signatures: [accounts.multiSig.summary.publicKey, ''],
      },
    },
    title: 'Test title',
    message: 'lorem ipsum',
    t: t => t,
    status: {
      code: txStatusTypes.signatureSuccess,
    },
    className: 'test-class',
    history: { push: jest.fn() },
    transactionBroadcasted: jest.fn(),
    resetTransactionResult: jest.fn(),
    account: accounts.multiSig,
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
      />,
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
      />,
    );
    expect(wrapper.find(FullySignedActions)).not.toExist();
    expect(wrapper.find(PartiallySignedActions)).toExist();

    wrapper.find('.download-button').at(0).simulate('click');
    expect(downloadJSONSpy).toHaveBeenCalledWith(props.transactions.signedTransaction, 'tx-1');
    wrapper.find('.copy-button').at(0).simulate('click');
    expect(copyToClipboard).toHaveBeenCalledWith(
      JSON.stringify(props.transactions.signedTransaction),
    );
  });

  it('should props.transactionBroadcasted', () => {
    const wrapper = mount(
      <Multisignature
        {...props}
        status={{
          code: txStatusTypes.multisigSignatureSuccess,
        }}
      />,
    );
    expect(wrapper.find(FullySignedActions)).toExist();
    expect(wrapper.find(PartiallySignedActions)).not.toExist();
    wrapper.find('.send-button').at(0).simulate('click');
    expect(props.transactionBroadcasted).toHaveBeenCalledWith(props.transactions.signedTransaction);
  });
});
