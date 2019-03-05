import React from 'react';
import { mount } from 'enzyme';
import Calendar from './calendar';

describe('Calendar component', () => {
  let wrapper;
  const props = {
    locale: 'en',
    date: '11.03.19',
    dateFormat: 'DD.MM.YY',
    onDateSelected: jest.fn(),
    minDate: '',
    maxDate: '',
  };

  beforeEach(() => {
    wrapper = mount(<Calendar {...props} />);
  });

  afterEach(() => {
    props.onDateSelected.mockReset();
  });

  it('Should render with correct Date on Month View', () => {
    expect(wrapper.find('.monthView .viewName')).toHaveText('March 2019');
    expect(wrapper.find('.yearView .viewName')).toHaveText('2019');
  });

  it('Should update showing month to new selected month', () => {
    const newProps = {
      ...props,
      date: '11.02.19',
    };
    wrapper.setProps(newProps);
    wrapper.update();
    expect(wrapper.find('.monthView .viewName')).toHaveText('February 2019');
  });

  it('Should change views', () => {
    expect(wrapper.find('.monthView')).not.toHaveClassName('hidden');
    wrapper.find('.monthView .viewName').last().simulate('click');
    expect(wrapper.find('.monthView')).toHaveClassName('hidden');
    expect(wrapper.find('.yearView')).not.toHaveClassName('hidden');
    wrapper.find('.monthItem').filter('[value="Feb"]').simulate('click', { target: { value: 'Feb' } });
    expect(wrapper.find('.yearView')).toHaveClassName('hidden');
    expect(wrapper.find('.monthView')).not.toHaveClassName('hidden');
  });
});
