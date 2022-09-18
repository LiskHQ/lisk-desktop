import React from 'react';
import { screen, render } from '@testing-library/react';
import { truncateAddress } from 'src/modules/wallet/utils/account';
import TransactionDetailRow from './TransactionDetailRow';
import { mockTransactions } from '../../__fixtures__';

describe('TransactionDetailRow', () => {
  const props = {
    data: {
      tooltip: 'test-tooltip',
      value: 'test value',
      label: 'test-title',
    },
    isParamsCollasped: false,
    onToggleJsonView: jest.fn(),
  };

  it('should display properly', async () => {
    render(<TransactionDetailRow {...props} />);

    const { tooltip, value, label } = props.data;
    expect(screen.getByText(value)).toBeTruthy();
    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByText(tooltip)).toBeTruthy();
    expect(screen.getByAltText('tooltipQuestionMark')).toBeTruthy();
  });

  it('should render address value', async () => {
    const sender = mockTransactions.data[0].sender;
    render(
      <TransactionDetailRow {...props} data={{ ...props.data, type: 'address', value: sender }} />
    );

    expect(screen.getByText(truncateAddress(sender.address))).toBeTruthy();
    expect(screen.getByText(sender.name)).toBeTruthy();
  });

  it('should render status value', async () => {
    const wrapper = render(
      <TransactionDetailRow {...props} data={{ ...props.data, type: 'status', value: 'pending' }} />
    );

    expect(screen.getByText('pending').className).toMatch(/pending/g);

    wrapper.rerender(
      <TransactionDetailRow {...props} data={{ ...props.data, type: 'status', value: 'success' }} />
    );
    expect(screen.queryByText('success').className).toMatch(/success/g);

    wrapper.rerender(
      <TransactionDetailRow {...props} data={{ ...props.data, type: 'status', value: 'fail' }} />
    );
    expect(screen.queryByText('fail').className).toMatch(/fail/g);
  });
});
