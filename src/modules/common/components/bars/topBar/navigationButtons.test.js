import React from 'react';
import { mount } from 'enzyme';
import NavigationButtons from './navigationButtons';

describe('Form', () => {
  let wrapper;

  const props = {
    account: {
      afterLogout: undefined,
    },
    history: {
      length: 0,
      location: {
        pathname: '',
      },
      goBack: jest.fn(),
      goForward: jest.fn(),
    },
  };

  beforeEach(() => {
    wrapper = mount(<NavigationButtons {...props} />);
  });

  afterEach(() => {
    props.history.goBack.mockReset();
    props.history.goForward.mockReset();
  });

  it('should render properly getting data from URL', () => {
    expect(wrapper).toContainMatchingElement('.navigation-buttons');
    expect(wrapper).toContainMatchingElement('.go-back');
    expect(wrapper).toContainMatchingElement('.go-forward');
  });

  it('should be able to go to the back page', () => {
    wrapper.find('.go-back').simulate('click');
    expect(props.history.goBack).not.toBeCalled();
    wrapper.setProps({
      history: {
        ...props.history,
        length: 3,
        action: 'PUSH',
      },
    });
    wrapper.update();
    wrapper.find('.go-forward').simulate('click');
    expect(props.history.goForward).toBeCalled();
    wrapper.find('.go-back').simulate('click');
    expect(props.history.goBack).toBeCalled();
  });

  it('should be able to go to the next page after user clicked the back arrow', () => {
    wrapper.find('.go-back').simulate('click');
    expect(props.history.goBack).not.toBeCalled();
    wrapper.find('.go-forward').simulate('click');
    expect(props.history.goForward).not.toBeCalled();
    wrapper.setProps({
      history: {
        ...props.history,
        length: 3,
      },
    });
    wrapper.update();
    wrapper.find('.go-forward').simulate('click');
    expect(props.history.goForward).toBeCalled();
  });

  it('should reset the navigation if user logout', () => {
    wrapper.setProps({
      account: {
        afterLogout: true,
      },
      history: {
        ...props.history,
        length: 3,
      },
    });
    wrapper.update();

    wrapper.find('.go-forward').simulate('click');
    expect(props.history.goForward).toBeCalled();
    wrapper.find('.go-back').simulate('click');
    expect(props.history.goBack).toBeCalled();
  });
});
