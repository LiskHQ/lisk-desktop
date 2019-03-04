import React from 'react';
import { shallow } from 'enzyme';
import YearView from './yearView';

describe('Calendar YearView', () => {
  let wrapper;
  const props = {
    isShown: true,
    setCurrentView: jest.fn(),
    setShowingDate: jest.fn(),
    selectedDate: '',
    showingDate: '01.03.19',
  };

  beforeEach(() => {
    wrapper = shallow(<YearView {...props} />);
  });

  afterEach(() => {
    props.setCurrentView.mockReset();
    props.setShowingDate.mockReset();
  });

  it('Should render showing current year', () => {
    expect(wrapper.find('.viewName')).toHaveText('2019');
  });

  it('Should set selected date when clicking on a day', () => {
    wrapper.find('.monthItem').filter('[value="Feb"]').simulate('click', { target: { value: 'Feb' } });
    expect(props.setCurrentView).toBeCalledWith('month');
    expect(props.setShowingDate).toBeCalled();
  });

  describe('navigation', () => {
    it('Should go to Previous year on click previous year arrow', () => {
      wrapper.find('.navigationButton').first().simulate('click');
      expect(props.setShowingDate).toBeCalled();
    });

    it('Should go to Next year on click next year arrow', () => {
      wrapper.find('.navigationButton').last().simulate('click');
      expect(props.setShowingDate).toBeCalled();
    });

    it('Should not be able to change years', () => {
      const newProps = {
        ...props,
        minDate: '01.01.19',
        maxDate: '31.12.19',
      };
      wrapper = shallow(<YearView {...newProps} />);
      wrapper.find('.navigationButton').first().simulate('click');
      expect(props.setShowingDate).not.toBeCalled();
      wrapper.find('.navigationButton').last().simulate('click');
      expect(props.setShowingDate).not.toBeCalled();
    });
  });
});
