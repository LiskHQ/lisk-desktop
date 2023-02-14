import React from 'react';
import { mount } from 'enzyme';
import withFilters from './withFilters';

describe('withFilters', () => {
  const className = 'dummyFilter';
  const apiName = 'validators';
  const validatorData = [{ username: 'test', id: 1 }, { username: 'Me', id: 2 }];
  const DummyComponent = props => (
    <span className={className}>
      <span className="filter" onChange={event => props.applyFilters(event.target.value)} />
    </span>
  );
  const initialFilters = { search: '' };
  const props = {
    [apiName]: {
      loadData: jest.fn().mockReturnValue(validatorData),
    },
  };
  const setup = () => {
    const DummyComponentHOC = withFilters(apiName, initialFilters)(DummyComponent);
    const wrapper = mount(<DummyComponentHOC {...props} />);
    return wrapper;
  };
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  it('should render passed component', () => {
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should call applyFilters with default filters', () => {
    wrapper.find('.filter').simulate('change');
    expect(props.validators.loadData).toHaveBeenCalledWith({ sort: undefined });
  });

  it('should call applyFilters with custom filters', () => {
    const filter = { search: 'random', limit: 20 };
    wrapper.find('.filter').simulate('change', {
      target: {
        value: filter,
        name: 'filters',
      },
    });
    expect(props.validators.loadData).toHaveBeenCalledWith({ sort: undefined, ...filter });
  });
});
