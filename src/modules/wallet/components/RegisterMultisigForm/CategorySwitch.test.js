import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CategorySwitch from './CategorySwitch';

describe('CategorySwitch', () => {
  const props = {
    onChangeCategory: jest.fn(),
    categories: [
      { value: 'TEST', label: 'test' },
      { value: 'TEST_1', label: 'test_1' },
    ],
    value: 'TEST',
    index: 0,
  };

  it('Should render properly', () => {
    render(<CategorySwitch {...props} />);

    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('test_1')).toBeTruthy();
    expect(screen.getByLabelText('test')).toHaveAttribute('checked');
    expect(screen.getByLabelText('test_1')).not.toHaveAttribute('checked');
  });

  it('Should not seelct a category initially', () => {
    render(<CategorySwitch {...props} value={null} />);

    expect(screen.getByLabelText('test')).not.toHaveAttribute('checked');
    expect(screen.getByLabelText('test_1')).not.toHaveAttribute('checked');
  });

  it('Should toggle selected category', async () => {
    render(<CategorySwitch {...props} value={null} />);

    fireEvent.click(screen.getByText('test'));

    await waitFor(() => {
      expect(props.onChangeCategory).toHaveBeenCalled();
    });
  });
});
