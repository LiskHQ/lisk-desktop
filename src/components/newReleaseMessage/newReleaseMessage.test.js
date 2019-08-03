import React from 'react';
import { mount } from 'enzyme';
import NewReleaseMessage from './newReleaseMessage';

describe('New release message banner', () => {
  const props = {
    t: v => v,
    version: '1.20.1',
    releaseNotes: '<h2>Release Summary</h2><h3>Fixed bugs</h3>',
    onClick: jest.fn(),
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<NewReleaseMessage {...props} />);
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).not.toIncludeText('Fixed bugs');
    expect(wrapper).toIncludeText('Release Summary');
    wrapper.find('button').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });
});
