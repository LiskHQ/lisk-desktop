import React from 'react';
import { shallow } from 'enzyme';
import MonthView from './monthView';

describe('Calendar MonthView', () => {
  let wrapper;
  const props = {
    isShown: true,
    setCurrentView: jest.fn(),
    onDateSelected: jest.fn(),
    setShowingDate: jest.fn(),
    selectedDate: '',
    showingDate: '01.03.19',
  };

  beforeEach(() => {
    wrapper = shallow(<MonthView {...props} />);
  });

  afterEach(() => {
    props.setCurrentView.mockClear();
    props.onDateSelected.mockClear();
    props.setShowingDate.mockClear();
  });

  it('Should render showing current month and year', () => {
    expect(wrapper.find('.viewName')).toHaveText('March 2019');
  });

  it('Should render as hidden if not current View', () => {
    const newProps = {
      ...props,
      isShown: false,
    };
    wrapper.setProps(newProps);
    wrapper.update();
    expect(wrapper).toContainExactlyOneMatchingElement('.hidden');
  });

  it('Should set selected date when clicking on a day', () => {
    wrapper.find('.dayItem').filter('[value="02.03.19"]').simulate('click', { target: { value: '02.03.19' } });
    expect(props.onDateSelected).toBeCalledWith('02.03.19');
  });

  describe('navigation', () => {
    it('Should go to Previous month on click previous month arrow', () => {
      wrapper.find('.navigationButton').first().simulate('click');
      expect(props.setShowingDate).toBeCalled();
    });

    it('Should go to Next month on click next month arrow', () => {
      wrapper.find('.navigationButton').last().simulate('click');
      expect(props.setShowingDate).toBeCalled();
    });

    it('Should show year view on clicking viewName', () => {
      wrapper.find('.viewName').simulate('click');
      expect(props.setCurrentView).toBeCalledWith('year');
    });

    it('Should not be able to change months', () => {
      const newProps = {
        ...props,
        minDate: props.showingDate,
        maxDate: props.showingDate,
      };
      wrapper = shallow(<MonthView {...newProps} />);
      wrapper.find('.navigationButton').first().simulate('click');
      expect(props.setShowingDate).not.toBeCalled();
      wrapper.find('.navigationButton').last().simulate('click');
      expect(props.setShowingDate).not.toBeCalled();
    });
  });
});
