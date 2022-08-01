import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import MessageField from './MessageField';

describe('MessageField', () => {
  const props = {
  };

  beforeEach(() => {
    jest.clearAllMocks();
    render(<MessageField {...props} />, props);
  });

  it('should render properly', () => {});
  it('should be collapsed', () => {});
  it('should not be collapsed', () => {});
  it('should show the number of bytes left', () => {});
});
