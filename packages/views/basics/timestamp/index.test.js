import React from 'react';
import { mount } from 'enzyme';

describe('components/toolbox/timestamp', () => {
  const inputValue = 1499983200;

  jest.spyOn(global.Date, 'now').mockImplementation(() => Date.UTC(2017, 1, 15));

  afterEach(() => {
    jest.resetAllMocks();
  });
});
