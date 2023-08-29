import React from 'react';

const { render, fireEvent } = require('@testing-library/react');
const { default: WarningNotification } = require('.');

describe('WarningNotification', () => {
  const props = {
    onDismiss: jest.fn(),
    message: 'test message',
    onClick: jest.fn(),
    isVisible: true,
  };

  it('should render properly', () => {
    const wrapper = render(<WarningNotification {...props} />);
    expect(wrapper.getByText(props.message)).toBeTruthy();

    fireEvent.click(wrapper.container.querySelector('.close-warning'));
    expect(props.onDismiss).toHaveBeenCalled();
  });

  it('should not rener the close button', () => {
    const wrapper = render(<WarningNotification {...props} onDismiss={undefined} />);
    expect(wrapper.container.querySelector('.close-warning')).toBeFalsy();
  });

  it('should be dismissed', () => {
    const wrapper = render(<WarningNotification {...props} isVisible={false} />);
    expect(wrapper.queryByText(props.message)).toBeFalsy();
  });
});
