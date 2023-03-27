import React from 'react';
import { mount } from 'enzyme';
import AnalyticsMessage from './analyticsMessage';

describe('Analytics Message banner', () => {
  const props = {
    t: (v) => v,
  };
  let wrapper;
  const pushMock = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <AnalyticsMessage
        history={{ push: pushMock, location: { search: '', path: '' } }}
        {...props}
      />
    );
  });

  it('Should render correctly with all passed props', () => {
    expect(wrapper).toIncludeText('Opt-in to sharing anonymous data in order to improve Lisk.');
    expect(wrapper).toIncludeText('Read more');
    wrapper.find('a.url-link').simulate('click');
    expect(pushMock).toHaveBeenCalledTimes(1);
  });
});
