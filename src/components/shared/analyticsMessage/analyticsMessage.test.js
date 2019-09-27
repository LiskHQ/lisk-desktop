import React from 'react';
import { mount } from 'enzyme';
import AnalyticsMessage from './analyticsMessage';

describe('Analytics Message banner', () => {
  const props = {
    t: v => v,
    onClick: jest.fn(),
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<AnalyticsMessage {...props} />);
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk Hub.');
    expect(wrapper).toIncludeText('Read more');
    wrapper.find('a.url-link').simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });
});
