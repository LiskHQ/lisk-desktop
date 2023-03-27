import React from 'react';
import { shallow } from 'enzyme';
import FlashMessage from './flashMessage';

describe('FlashMessage', () => {
  let wrapper;
  const props = { shouldShow: true };
  const content = <FlashMessage.Content>Test Content</FlashMessage.Content>;
  const btnProps = {
    onClick: jest.fn(),
    children: 'Dummy button',
  };
  const button = <FlashMessage.Button {...btnProps} />;

  it('should render with close button and hide on button click', () => {
    wrapper = shallow(<FlashMessage {...props}>{content}</FlashMessage>);
    wrapper.find('.closeBtn').simulate('click');
    expect(wrapper).not.toHaveClassName('show');
  });

  it('should not render close button if children has FlashMessage.Button', () => {
    wrapper = shallow(
      <FlashMessage {...props}>
        {content}
        {button}
      </FlashMessage>
    );
    expect(wrapper).not.toContainMatchingElement('.closeBtn');
    wrapper.find(FlashMessage.Button).simulate('click');
    expect(btnProps.onClick).toBeCalled();
  });
});
