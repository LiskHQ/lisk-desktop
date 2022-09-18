import React from 'react';
import {
  fireEvent, screen, render, waitFor,
} from '@testing-library/react';
import { mockEvents } from '../../__fixtures__';
import TransactionEventsRow from './TransactionDetailRow';

describe('TransactionEventsRow', () => {
  it('should display properly', async () => {
    const props = {
      data: mockEvents.data[0],
    };
    render(<TransactionEventsRow {...props} />);

    const {
      id, index, typeID, module,
    } = props.data;
    expect(screen.queryAllByText(id));
    expect(screen.queryAllByText(index));
    expect(screen.queryAllByText(typeID));
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
      expect(screen.queryByTestId('transaction-event-json-viewer').className).not.toContain('shrink');
    });

    fireEvent.click(screen.queryByAltText('arrowRightInactive'));

    await waitFor(() => {
      expect(screen.queryByTestId('transaction-event-json-viewer').className).toContain('shrink');
    });
  });
});
