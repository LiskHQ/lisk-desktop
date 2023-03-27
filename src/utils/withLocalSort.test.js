import React from 'react';
import { mount } from 'enzyme';
import withLocalSort from './withLocalSort';

describe('withLocalSort', () => {
  const className = 'dummy';
  const dataKey = 'dataKey';
  const DummyComponent = (props) => (
    <span className={className}>
      <span className="sort" onClick={() => props.changeSort('id')} />
      {props[dataKey].data.map((data) => (
        <span key={data.id}>{data.id}</span>
      ))}
    </span>
  );
  const initialSort = 'id:asc';
  const props = {
    [dataKey]: {
      data: [
        {
          id: 2,
        },
        {
          id: 1,
        },
        {
          id: 3,
        },
      ],
    },
  };
  const setup = () => {
    const DummyComponentHOC = withLocalSort(dataKey, initialSort)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC {...props} />);
    return wrapper;
  };

  it('should render passed component', () => {
    const wrapper = setup();
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should change oder of passed data if props.onSortChange is called', () => {
    const wrapper = setup();
    expect(wrapper).toHaveText('123');
    wrapper.find('.sort').simulate('click');
    expect(wrapper).toHaveText('321');
    wrapper.find('.sort').simulate('click');
    expect(wrapper).toHaveText('123');
  });
});
