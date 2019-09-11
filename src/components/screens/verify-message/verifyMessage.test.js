import React from 'react';
import { mount } from 'enzyme';
import VerifyMessage from './verifyMessage';
import routes from '../../../constants/routes';

describe('VerifyMessage Component', () => {
  const props = {
    history: {
      location: { search: '' },
      goBack: jest.fn(),
      push: jest.fn(),
    },
    t: v => v,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<VerifyMessage {...props} />);
  });

  it('should render properly', () => {
    expect(wrapper).toContainExactlyOneMatchingElement('MultiStep');
  });

  it('should allow to go forward and back', () => {
    wrapper.find('.continue button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.go-to-dashboard button');
    wrapper.find('.go-back button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.continue button');
    wrapper.find('.continue button').simulate('click');
    expect(wrapper).toContainExactlyOneMatchingElement('.go-to-dashboard button');
    wrapper.find('.go-to-dashboard button').simulate('click');
    expect(props.history.push).toHaveBeenCalledWith(routes.dashboard.path);
  });
});
