import React from 'react';
import { mount } from 'enzyme';
import WarningMessage from './index';

describe('New release message banner', () => {
  const props = {
    t: v => v,
    title: 'sample warning message',
    children: <p>test text</p>,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<WarningMessage {...props} />);
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).toIncludeText('sample warning message');
    expect(wrapper).toIncludeText('test text');
  });
});
