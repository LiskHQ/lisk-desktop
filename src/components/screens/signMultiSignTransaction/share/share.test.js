import React from 'react';
import { mount } from 'enzyme';
import Share from './share';
import accounts from '../../../../../test/constants/accounts';

describe('Sign Multisignature Tx Share component', () => {
  let wrapper;
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
    t: v => v,
    networkIdentifier: '',
    senderAccount: {
      keys: {
        numberOfSignatures: 2,
        mandatoryKeys: ['2fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a','0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a'],
        optionalKeys: [],
      },
    },
    transaction,
  };

  it('Should render properly on success', () => {
    wrapper = mount(
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
    wrapper = mount(
      <Share
        {...props}
        error="testerror"
      />,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Error: testerror');
    expect(html).toContain('Report the error via E-Mail');
  });
});
