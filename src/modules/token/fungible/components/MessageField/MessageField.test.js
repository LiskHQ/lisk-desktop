import React from 'react';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import MessageField from './MessageField';

describe('MessageField', () => {
  let wrapper;
  const props = {
    onChange: jest.fn(),
    onRemove: jest.fn(),
    value: '',
    maxMessageLength: 10,
    label: 'label',
    placeholder: 'placeholder',
    error: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = render(<MessageField {...props} />);
  });

  it('should be in shrink mode when its mounted', () => {
    expect(screen.queryByText('Add message (Optional)')).toBeTruthy();
    expect(screen.queryByText(props.label)).toBeFalsy();
    expect(screen.queryByText('Remove')).toBeFalsy();
    expect(screen.queryByAltText('removeBlueIcon')).toBeFalsy();
  });

  it('should be toggled between collapsed and shrink mode', () => {
    fireEvent.click(screen.queryByText('Add message (Optional)'));

    expect(screen.queryByText('Add message (Optional)')).toBeFalsy();
    expect(screen.queryByText(props.label)).toBeTruthy();
    expect(screen.queryByText('Remove')).toBeTruthy();
    expect(screen.queryByAltText('removeBlueIcon')).toBeTruthy();

    fireEvent.click(screen.queryByText('Remove'));

    expect(screen.queryByText('Add message (Optional)')).toBeTruthy();
    expect(screen.queryByText(props.label)).toBeFalsy();
    expect(screen.queryByText('Remove')).toBeFalsy();
    expect(screen.queryByAltText('removeBlueIcon')).toBeFalsy();
  });

  it('should show the byte counter', () => {
    props.feedback = '1 byte left';
    wrapper.rerender(<MessageField {...props} />);

    fireEvent.click(screen.queryByText('Add message (Optional)'));
    expect(screen.getByTestId('feedback').textContent).toContain(props.feedback);
  });

  it('should react with an error on byte count', () => {
    props.value =
      'this is a test value that should be long enough to throw an error testing testing testing testing';
    props.error = true;
    wrapper.rerender(<MessageField {...props} />);

    fireEvent.click(wrapper.queryByText('Add message (Optional)'));
    expect(/error/.test(wrapper.getByTestId('feedback').className)).toBeTruthy();
    expect(wrapper.getByAltText('alertIcon').className).toBeTruthy();
  });

  it('should be collapsed when it has a value', async () => {
    props.value = 'test message';
    render(<MessageField {...props} />);

    await waitFor(() => {
      expect(screen.getAllByText('label')[0]).toBeTruthy();
    });
  });
});
