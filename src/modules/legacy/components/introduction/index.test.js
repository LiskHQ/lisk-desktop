import React from 'react';
import { mount } from 'enzyme';
import Introduction from './index';
import styles from './introduction.css';

window.open = jest.fn();

describe('Reclaim balance introduction screen', () => {
  const props = { nextStep: jest.fn() };

  it('Opens lisk blog windows', () => {
    const wrapper = mount(<Introduction {...props} />);
    wrapper.find('.link').first().simulate('click');
    expect(window.open).toHaveBeenCalledWith(
      'https://lisk.com/blog/development/actions-required-upcoming-mainnet-migration',
      '_blank',
      'rel=noopener noreferrer',
    );
  });

  it('should go to nextStep', () => {
    const wrapper = mount(<Introduction {...props} />);
    wrapper.find(styles.button).first().simulate('click');
    expect(props.nextStep).toHaveBeenCalledTimes(1);
  });
});
