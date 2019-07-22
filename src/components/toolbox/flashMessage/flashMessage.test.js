import React from 'react';
import { mount } from 'enzyme';
import externalLinks from '../../../constants/externalLinks';
import FlashMessage from './flashMessage';

describe('FlashMessage', () => {
  let wrapper;
  const props = {
    buttonText: 'Initialize account',
    displayText: 'Account without init',
    iconName: 'warningIcon',
    linkCaption: 'Learn more',
    linkUrl: externalLinks.accountInitialization,
    onButtonClick: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<FlashMessage {...props} />);
  });

  it('should render properly all the components', () => {
    expect(wrapper).toContainMatchingElement('.icon');
    expect(wrapper).toContainMatchingElement('.display-text');
    expect(wrapper).toContainMatchingElement('.url-link');
    expect(wrapper).toContainMatchingElement('.button');
  });

  it('should render all component but no the icon if prop is empty', () => {
    const newProps = { ...props, iconName: '' };
    wrapper = mount(<FlashMessage {...newProps} />);
    expect(wrapper).not.toContainMatchingElement('.icon');
    expect(wrapper).toContainMatchingElement('.display-text');
    expect(wrapper).toContainMatchingElement('.url-link');
    expect(wrapper).toContainMatchingElement('.button');
  });

  it('should render all component but no the link if prop is empty', () => {
    const newProps = { ...props, linkUrl: '', linkCaption: '' };
    wrapper = mount(<FlashMessage {...newProps} />);
    expect(wrapper).toContainMatchingElement('.icon');
    expect(wrapper).toContainMatchingElement('.display-text');
    expect(wrapper).not.toContainMatchingElement('.url-link');
    expect(wrapper).toContainMatchingElement('.button');
  });

  it('should render all component but no the button if prop is empty', () => {
    const newProps = { ...props, buttonText: '' };
    wrapper = mount(<FlashMessage {...newProps} />);
    expect(wrapper).toContainMatchingElement('.icon');
    expect(wrapper).toContainMatchingElement('.display-text');
    expect(wrapper).toContainMatchingElement('.url-link');
    expect(wrapper).not.toContainMatchingElement('.button');
  });

  it('should call onClick prop function when button clicked', () => {
    expect(wrapper).toContainMatchingElement('.button');
    expect(wrapper.find('.button').at(0).text()).toEqual(`${props.buttonText}`);
    wrapper.find('.button').at(0).simulate('click');
    expect(props.onButtonClick).toBeCalled();
  });
});
