import React from 'react';
import { shallow } from 'enzyme';
import TableRow from './tableRow';

describe('Table Row', () => {
  let wrapper = shallow(<TableRow />);

  it('Should render without cells', () => {
    expect(wrapper.props().children).toBeFalsy();
  });

  it('Should render with passed childrens', () => {
    const cells = [1, 2, 3].map(x => <div className={'cell'} key={x}>{x}</div>);
    wrapper = shallow(<TableRow>{cells}</TableRow>);
    expect(wrapper).toContainMatchingElements(3, '.cell');
  });

  it('Should render as header', () => {
    const cells = [1, 2, 3].map(x => <div className={'cell'} key={x}>{x}</div>);
    wrapper = shallow(<TableRow isHeader>{cells}</TableRow>);
    expect(wrapper).toHaveClassName('header');
  });
});
