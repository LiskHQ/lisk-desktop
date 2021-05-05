import React from 'react';
import { mount } from 'enzyme';
import TransactionSummary from './index';

describe('TransactionSummary', () => {
  let props;
  const hwInfo = {
    deviceModel: 'Trezor Model T',
    deviceId: 'mock id',
  };

  beforeEach(() => {
    props = {
      title: 'mock title',
      account: {},
      confirmButton: {
        label: 'Confirm',
        onClick: jest.fn(),
      },
      cancelButton: {
        label: 'Cancel',
      },
      t: key => key,
    };
  });

  it('should render title', () => {
    const wrapper = mount(<TransactionSummary {...props} />);
    expect(wrapper.find('h2').text()).toEqual(props.title);
  });

  it('should render hw wallet confirmation if props.acount.hwInfo', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      account: { hwInfo },
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).toHaveBeenCalled();
  });

  it('should not render hw wallet confirmation if props.acount.hwInfo and props.confirmButton.disabled', () => {
    const wrapper = mount(<TransactionSummary {...{
      ...props,
      confirmButton: {
        ...props.confirmButton,
        disabled: true,
      },
      account: { hwInfo },
    }}
    />);
    expect(wrapper.find('h2')).toIncludeText('Confirm transaction on your');
    expect(wrapper.find('.confirm-button')).toHaveLength(0);
    expect(props.confirmButton.onClick).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
