import React from 'react';
import { screen, render } from '@testing-library/react';
import routes from 'src/routes/routes';
import AccountCreationTips from './index';


describe('AccountCreationTips', () => {
  it('displays properly', () => {
    render(<AccountCreationTips />);
    expect(screen.getByText('Get started')).toBeInTheDocument();
    expect(screen.getByText('Your Lisk address')).toBeInTheDocument();
    expect(screen.getByText('A unique avatar')).toBeInTheDocument();
    expect(screen.getByText('Manage your account')).toBeInTheDocument();
  });

  it('navigates to correct routes', () => {
    render(<AccountCreationTips />);
    const links = screen.queryAllByRole('link');
    expect(links.at(0).href).toBe(`http://localhost${routes.register.path}`);
    expect(links.at(1).href).toBe(`http://localhost${routes.addAccount.path}`);
  });
});
