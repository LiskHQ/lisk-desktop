import React from 'react';
import { screen, render } from '@testing-library/react';
import routes from 'src/routes/routes';
import AccountCreationTips from './index';

describe('AccountCreationTips', () => {
  it('displays properly', () => {
    render(<AccountCreationTips />);
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Lisk')).toBeInTheDocument();
    expect(screen.getByText('Don’t have a Lisk account yet?')).toBeInTheDocument();
    expect(screen.getByText('Why do I need an account?')).toBeInTheDocument();
    expect(screen.getByText('Send and request tokens')).toBeInTheDocument();
    expect(screen.getByText('Participate in blockchain governance')).toBeInTheDocument();
    expect(screen.getByText('Monitor the Blockchain')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Add account')).toBeInTheDocument();
  });

  it('navigates to correct routes', () => {
    render(<AccountCreationTips />);
    const links = screen.queryAllByRole('link');
    expect(links[0].href).toBe(`http://localhost${routes.register.path}`);
    expect(links[1].href).toBe(`http://localhost${routes.addAccountOptions.path}`);
  });
});
