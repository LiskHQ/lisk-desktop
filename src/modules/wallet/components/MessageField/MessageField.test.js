import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import MessageField from './MessageField';

describe('MessageField', () => {
  let wrapper;
  const props = {
    onChange: jest.fn(),
    value: 'test message',
    maxMessageLength: 10,
    label: 'label',
    placeholder: 'placeholder',
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

  it('should be collapsed', () => {
    fireEvent.click(screen.queryByText('Add message (Optional)'));

    expect(screen.queryByText('Add message (Optional)')).toBeFalsy();
    expect(screen.queryByText(props.label)).toBeTruthy();
    expect(screen.queryByText('Remove')).toBeTruthy();
    expect(screen.queryByAltText('removeBlueIcon')).toBeTruthy();
  });

  it('should show the byte counter', () => {
    props.feedback = '1 byte left';
    wrapper.rerender(<MessageField {...props} />);

    fireEvent.click(screen.queryByText('Add message (Optional)'));
    expect(screen.getByTestId('feedback').textContent).toContain(props.feedback);
  });
});
