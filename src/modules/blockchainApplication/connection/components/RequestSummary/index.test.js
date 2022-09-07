import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import useSession from '@libs/wcm/hooks/useSession';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { context as defaultContext } from '../../__fixtures__/requestSummary';
import RequestSummary from './index';

const nextStep = jest.fn();

jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));
jest.mock('@transaction/utils/transaction', () => ({
  elementTxToDesktopTx: jest.fn().mockReturnValue({}),
  convertTxJSONToBinary: jest.fn().mockReturnValue({}),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));
jest.mock('@libs/wcm/utils/requestHandlers', () => ({
  rejectLiskRequest: jest.fn(),
}));
jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: { id: '1' } }],
}));
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));
jest.mock('@transaction/api');

const setup = (context) => {
  const Component = () => (
    <ConnectionContext.Provider value={context}>
      <RequestSummary nextStep={nextStep} />
    </ConnectionContext.Provider>
  );

  return render(<Component />);
};

describe('RequestSummary', () => {
  const reject = jest.fn();
  useSession.mockReturnValue({ reject, session: defaultContext.session });

  it('Display the requesting app information', () => {
    setup(defaultContext);
    expect(screen.getByTestId('logo')).toHaveAttribute('src', 'http://example.com/icon.png');
    expect(screen.getByText('Sign transaction')).toBeTruthy();
    expect(screen.getByText('test app')).toBeTruthy();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('Reject the request if the reject button is clicked', () => {
    setup(defaultContext);
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(rejectLiskRequest).toHaveBeenCalled();
  });

  it('Normalize the rawTx object and send it to the next step', () => {
    setup(defaultContext);
    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(nextStep).toHaveBeenCalled();
  });
});
