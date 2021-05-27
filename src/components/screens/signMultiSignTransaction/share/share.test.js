import React from 'react';
import { mount } from 'enzyme';
import Share from './share';

describe('Sign Multisignature Tx Share component', () => {
  const props = {
    t: v => v,
    transactionInfo: { id: 1 },
  };

  it('Should render properly on success', () => {
    const wrapper = mount(
      <Share
        {...props}
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
        error="testerror"
      />,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('testerror');
    expect(html).toContain('Report the error via E-Mail');
  });
});
