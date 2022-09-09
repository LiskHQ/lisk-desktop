import React from 'react';
import { shallow } from 'enzyme';
import Content from './content';

describe('FlashMessage', () => {
  let wrapper;
  const props = {
    icon: 'warningIcon',
    className: 'content-class',
    link: {
      label: 'dummy link',
      action: 'http://',
    },
    children: 'Dummy content',
  };

  const setup = (data) => shallow(<Content {...data} />);

  it('should render with passed content', () => {
    wrapper = setup(props);
    expect(wrapper).toIncludeText(props.children);
    expect(wrapper.find('Icon')).toHaveProp('name', props.icon);
    expect(wrapper.find('a')).toHaveText(props.link.label);
    expect(wrapper.find('a')).toHaveProp('href', props.link.action);
  });

  it('should not render icon and link if props are not set', () => {
    wrapper = setup({ ...props, icon: undefined, link: {} });
    expect(wrapper).not.toContainMatchingElement('Icon');
    expect(wrapper).not.toContainMatchingElement('a');
  });

  it('should render link with onClick if action is a function', () => {
    const action = jest.fn();
    wrapper = setup({ ...props, link: { ...props.link, action } });
    expect(wrapper.find('a')).toHaveProp('onClick', action);
    wrapper.find('a').simulate('click');
    expect(action).toHaveBeenCalled();
  });

  it('should be possible to render with element on children', () => {
    const children = (
      <p>
        <strong>Dummy</strong>
        text
      </p>
    );
    wrapper = setup({ ...props, children });
    expect(wrapper.contains(children)).toBe(true);
  });
});
