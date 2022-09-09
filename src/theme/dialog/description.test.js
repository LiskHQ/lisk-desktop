import React from 'react';
import { shallow } from 'enzyme';
import Description from './description';

describe('Dialo.Description component', () => {
  it('Should render single element or multiple elements', () => {
    const child = (
      <div>
        <p>
          Dummy
          <strong>text</strong>
        </p>
      </div>
    );
    let wrapper = shallow(<Description>{child}</Description>);
    expect(wrapper).toContainReact(child);
    wrapper = shallow(
      <Description>
        {child}
        {child}
      </Description>
    );
    expect(wrapper).toContainMatchingElements(2, 'p');
  });
});
