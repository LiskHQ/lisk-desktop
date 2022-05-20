import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import AccountSelect from './AccountSelect';

const savedAccounts = [
  {
    crypto: {
      kdf: 'argon2id',
      kdfparams: {
        parallelism: 4,
        iterations: 1,
        memory: 2048,
        salt: '30fc0301d36fcdc7bd8204e19a0043fc',
      },
      cipher: 'aes-256-gcm',
      cipherparams: {
        iv: '281d21872c2d303e59850ce4',
        tag: '2458479edf6aea5c748021ae296e467d',
      },
      ciphertext: '44fdb2b132d353a5c65f04e5e3afdd531f63abc45444ffd4cdbc7dedc45f899bf5b7478947d57319ea8c620e13480def8a518cc05e46bdddc8ef7c8cfc21a3bd',
    },
    metadata: {
      name: 'my lisk account',
      description: 'ed25519 key pair',
      pubkey: 'c6bae83af23540096ac58d5121b00f33be6f02f05df785766725acdd5d48be9d',
      path: "m/44'/134'/0'",
      address: 'lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e',
      creationTime: '',
      derivedFromUUID: 'fa3e4ceb-10dc-41ad-810e-17bf51ed93aa',
    },
    uuid: 'ef52c117-d7cc-4246-bc9d-4dd506bef82f',
    version: 1,
  },
];

jest.mock('react-i18next');
jest.mock('../../hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockReturnValue([savedAccounts]),
}));

const props = {
  onSelectAccount: jest.fn(),
  onRemoveAccount: jest.fn(),
};

beforeEach(() => {
  render(<AccountSelect {...props} />);
});

describe('Select Account Formshould work', () => {
  it('Should render account list properly', async () => {
    expect(screen.getByText('lsk74ar23k2zk3mpsnryxbxf5yf9ystudqmj4oj6e')).toBeTruthy();
    expect(screen.getByText('my lisk account')).toBeTruthy();
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });

  it('Should trigger the onSelectAccount callback', async () => {
    fireEvent.click(screen.getByTestId(savedAccounts[0].uuid));
    expect(props.onSelectAccount).toBeCalledWith(savedAccounts[0]);
  });

  it('Should show accounts with the delete trigger', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    expect(screen.getByText('Done')).toBeTruthy();
    expect(screen.getByText('Choose account')).toBeTruthy();
    fireEvent.click(screen.getByTestId('delete-icon'));
    expect(props.onRemoveAccount).toBeCalledWith(savedAccounts[0]);
  });

  it('Should revert back to select account if done is clicked', async () => {
    fireEvent.click(screen.getByText('Remove an account'));
    fireEvent.click(screen.getByText('Done'));
    expect(screen.getByText('Remove an account')).toBeTruthy();
    expect(screen.getByText('Add another account')).toBeTruthy();
    expect(screen.getByText('Manage accounts')).toBeTruthy();
  });
});
