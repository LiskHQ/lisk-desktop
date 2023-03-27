import React from 'react';
import { render, screen } from '@testing-library/react';
import Div from './Div';

describe('WalletDetails', () => {
  it('Should render children', () => {
    render(
      <Div>
        <p>test</p>
      </Div>
    );
    expect(screen.getByText('test')).toBeTruthy();
  });
});
