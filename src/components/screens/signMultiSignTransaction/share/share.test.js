import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Share from './share';
import flushPromises from '../../../../../test/unit-test-utils/flushPromises';

describe.skip('Sign Multisignature Tx Share component', () => {
  const transaction = {
    moduleID: 2,
    assetID: 0,
    senderPublicKey: '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
    nonce: 77n,
    fee: 207000n,
    signatures: ['58f171c34169eb6745efb415ece433dee6bf76b4d889fdff237ee0b68dffb53eca718e40dbedd455e9c8151faa8f18455ee4ae63e19ac5e131bd70422654690a', ''],
    asset: {
      recipientAddress: 'd04699e57c4a3846c988f3c15306796f8eae5c1c',
      amount: '100000000n',
      data: '',
    },
    id: '717ebbf620adfc70e53859acca9fbc61c300a2bf090455facd35de006d41e733',
  };

  const props = {
    t: (str, dict) => (dict ? str.replace('{{errorMessage}}', dict.errorMessage) : str),
    history: jest.fn(),
    networkIdentifier: '',
    senderAccount: {
      keys: {
        numberOfSignatures: 2,
        mandatoryKeys: ['2fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a', '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
        optionalKeys: [],
      },
    },
    txBroadcastError: null,
    transaction,
    transactionBroadcasted: jest.fn(),
  };

  it('Should render properly on success', () => {
    const wrapper = mount(
      <Share
        {...props}
        transaction={transaction}
      />,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('You have successfully signed the transaction');
    expect(html).toContain('Download');
    expect(html).toContain('Copy');
  });

  it('Should render properly on error', () => {
    const wrapper = mount(
      <Share
        {...props}
        txBroadcastError={{ error: { message: 'testerror' } }}
        error="testerror"
      />,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Error signing the transaction: testerror');
    expect(html).toContain('Report the error via email');
  });

  it('Should display an error message if broadcasting fails', async () => {
    const wrapper = mount(
      <Share
        {...props}
        transaction={{
          ...props.transaction,
          signatures: [props.transaction.signatures[0], props.transaction.signatures[0]],
        }}
      />,
    );
    const sendButton = wrapper.find('.send-button button');
    expect(sendButton).not.toBeDisabled();
    sendButton.simulate('click');
    await flushPromises();
    act(() => { wrapper.update(); });
    wrapper.setProps({ txBroadcastError: { error: { message: 'Bad request.' } } });
    act(() => { wrapper.update(); });
    expect(wrapper.html()).toContain('Error broadcasting the transaction: Bad request.');
  });
});
