import React from 'react';
import { mount } from 'enzyme';
import NewReleaseMessage from './newReleaseMessage';

describe('New release message banner', () => {
  const props = {
    t: v => v,
    version: '1.20.1',
    releaseSummary: 'Release Summary',
    releaseNotes: '<h3>Fixed bugs</h3>',
    readMore: jest.fn(),
    updateNow: jest.fn(),
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<NewReleaseMessage {...props} />);
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).not.toIncludeText('Fixed bugs');
    expect(wrapper).toIncludeText('Release Summary');
    wrapper.find('button').at(0).simulate('click');
    expect(props.updateNow).toHaveBeenCalled();
    wrapper.find('button').at(1).simulate('click');
    expect(props.readMore).toHaveBeenCalled();
  });
});
