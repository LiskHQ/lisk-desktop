import React from 'react';
import { mount } from 'enzyme';
import Form from './form';

describe('Unlock LSK form', () => {
  const props = {
    t: str => str,
    nextStep: jest.fn(),
    data: {
      customFee: { value: '100' },
      fee: { value: '100' },
      unlockableBalance: '10000000',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls nextStep when clicked on confirm', async () => {
    const wrapper = mount(<Form {...props} />);
    wrapper.find('.unlock-btn button').simulate('click');
    expect(props.nextStep).toBeCalledWith(
      expect.objectContaining({ rawTransaction: { selectedFee: '100' } }),
    );
  });

  it('does not call nextStep when unlockableBalance is zero', async () => {
    const noUnlockProps = {
      ...props,
      data: {
        ...props.data,
        unlockableBalance: 0,
      },
    };
    const wrapper = mount(<Form {...noUnlockProps} />);
    wrapper.find('.unlock-btn button').simulate('click');
    expect(props.nextStep).not.toBeCalled();
  });
});
