import React from 'react';
import { mount } from 'enzyme';
import Network from './index';

describe('Network view', () => {
  const t = jest.fn().mockImplementation(str => str);

  it('Renders to component correctly', () => {
    const wrapper = mount(<Network t={t} />);
    expect(wrapper.find('h1').at(0)).toHaveText('Network statistics');
    expect(wrapper.find('h1').at(1)).toHaveText('Connected peers');
    expect(wrapper.find('Statistics')).toHaveLength(1);
    expect(wrapper.find('NodeList')).toHaveLength(1);
  });
});
