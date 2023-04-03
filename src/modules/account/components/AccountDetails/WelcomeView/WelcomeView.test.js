import React from 'react';

import { screen, render } from '@testing-library/react';
import WelcomeView from './index';

describe('WelcomeView', () => {
  it('should render properly', async () => {
    render(<WelcomeView />);
    expect(screen.getByText('Welcome to Lisk')).toBeTruthy();
  });
});
