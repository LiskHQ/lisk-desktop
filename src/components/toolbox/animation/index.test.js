import React from 'react';
import { shallow } from 'enzyme';
import Animation from './';

describe('Animation component', () => {
  const props = {
    name: '',
    loop: true,
    autoplay: true,
    renderer: 'svg',
    className: 'test-classname',
  };

  it('Should render animation container with className', () => {
    const wrapper = shallow(<Animation {...props} name={'delegateCreated'} />);
    expect(wrapper).toMatchElement(<div/>);
    expect(wrapper).toHaveClassName(props.className);
  });
});
