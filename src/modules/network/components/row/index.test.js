import { act } from 'react-dom/test-utils';
import React from 'react';
import { mount } from 'enzyme';
import Row from './index';

describe('Peer Row', () => {
  const props = {
    data: {
      ip: '192.168.0.1',
      height: 12000,
      location: {
        countryCode: 49,
      },
      networkVersion: '3.0',
      port: 8080,
    },
    className: 'customTestClassNames',
  };

  it('renders the data properly', () => {
    const wrapper = mount(<Row {...props} />);
    expect(wrapper.find('span').at(0)).toHaveText('192.168.0.1');
    expect(wrapper.find('span').at(1)).toHaveText('8080');
    expect(wrapper.find('.network-span')).toHaveText('3.0');
  });

  it('does not re-render if height or ip do not change', () => {
    const wrapper = mount(<Row {...props} />);
    expect(wrapper.find('span').at(0)).toHaveText('192.168.0.1');
    wrapper.setProps({
      data: {
        ...props.data,
        networkVersion: '4.0',
      },
    });
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('.network-span').at(0)).toHaveText('3.0');
    wrapper.setProps({
      data: {
        ...props.data,
        ip: '192.168.0.2',
      },
    });
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('span').at(0)).toHaveText('192.168.0.2');
  });
});
