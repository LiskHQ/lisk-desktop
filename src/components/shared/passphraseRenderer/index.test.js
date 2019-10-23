import React from 'react';
import { mount } from 'enzyme';
import PassphraseRenderer from '.';

describe('PassphraseRenderer', () => {
  let wrapper;
  const props = {
    values: [
      'belt',
      'recall',
      'lawn',
      'work',
      'slide',
      'lion',
      'very',
      'ball',
      'table',
      'upset',
      'coil',
      'rat',
    ],
    options: {
      2: ['thunder', 'lawn', 'gorilla'],
      9: ['upset', 'jaw', 'grim'],
    },
    missingWords: [2, 9],
    handleSelect: jest.fn(),
  };


  it('should should allow to select an option', () => {
    wrapper = mount(<PassphraseRenderer {...props} />);
    wrapper.find('.emptyInput').at(0).simulate('click');
    wrapper.find('div.option').at(0).simulate('click');
    expect(props.handleSelect).toHaveBeenCalledWith('thunder', 2);
  });
});
