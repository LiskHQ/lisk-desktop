import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { mockEvents } from '../../__fixtures__';
import TransactionEventsRow from './TransactionEventsRow';

describe('TransactionEventsRow', () => {
  it('should display properly', async () => {
    const props = {
      data: mockEvents.data[0],
    };
    render(<TransactionEventsRow {...props} />);

    const { id, index, name, module } = props.data;
    expect(screen.queryAllByText(id));
    expect(screen.queryAllByText(index));
    expect(screen.queryAllByText(name));
    expect(screen.queryAllByText(module));
    expect(screen.queryByAltText('arrowRightInactive'));

    expect(screen.queryByTestId('transaction-event-json-viewer').className).toContain('shrink');
  });

  it('should display properly in wallet mode', async () => {
    const props = {
      data: mockEvents.data[0],
    };
    render(<TransactionEventsRow {...props} isWallet />);

    const { block, topics, name, module } = props.data;
    expect(screen.queryAllByText(topics[0]));
    expect(screen.queryAllByText(block.height));
    expect(screen.queryAllByText(name));
    expect(screen.queryAllByText(module));
    expect(screen.queryByAltText('arrowRightInactive'));

    expect(screen.queryByTestId('transaction-event-json-viewer').className).toContain('shrink');
  });

  it('should event json viewer', async () => {
    const props = {
      data: mockEvents.data[0],
    };
    render(<TransactionEventsRow {...props} />);

    fireEvent.click(screen.queryByAltText('arrowRightInactive'));

    await waitFor(() => {
      expect(screen.queryByTestId('transaction-event-json-viewer').className).not.toContain(
        'shrink'
      );
    });

    fireEvent.click(screen.queryByAltText('arrowRightInactive'));

    await waitFor(() => {
      expect(screen.queryByTestId('transaction-event-json-viewer').className).toContain('shrink');
    });
  });

  it('should render default value when event has missing data', async () => {
    const props = {
      data: {
        block: {
          id: '625835480267616579',
          height: 8350681,
          timestamp: 28227090,
        },
      },
    };
    render(<TransactionEventsRow {...props} isWallet />);

    expect(screen.queryAllByText('-'));
  });
});
