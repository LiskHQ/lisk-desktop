import React from 'react';
import { render, screen } from '@testing-library/react';
import SetPasswordMultiStep from './SetPasswordMultiStep';

jest.mock('react-i18next');

const props = {
  onSubmit: jest.fn((value) => value),
};

beforeEach(() => {
  render(<SetPasswordMultiStep {...props} />);
});

describe('Set password multi step', () => {
  it('should render set password as the first page', async () => {
    expect(screen.getByTestId('setPasswordFormContainer')).toBeTruthy();
  });
});
