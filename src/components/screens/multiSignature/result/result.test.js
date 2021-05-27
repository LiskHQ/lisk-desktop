import React from 'react';
import { mount } from 'enzyme';
import Result from './result';

describe('Multisignature result component', () => {
  const props = {
    t: v => v,
    transaction: {
      moduleId: 2,
      assetId: 0,
      id: 1,
    },
  };

  it('Should render properly on success', () => {
    const wrapper = mount(
      <Result
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
      <Result
        {...props}
        error={{ message: 'error:test' }}
      />,
    );
    const html = wrapper.html();
    expect(html).toContain('transaction-status');
    expect(html).toContain('Oops, looks like something went wrong.');
    expect(html).toContain('Report the error via E-Mail');
  });
});
