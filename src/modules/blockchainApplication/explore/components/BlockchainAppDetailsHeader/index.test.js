import React from 'react';
import { render, screen } from '@testing-library/react';
import BlockchainAppDetailsHeader from '.';

const appName = 'Enevti';
const appAddress = 'evtguo9kqnea2zsfo3a6qppozsxsg92nuuma3p7ad';
const appUrl = 'https://enevti.com';

const application = {
  data: {
    name: appName,
    address: appAddress,
    projectPage: appUrl,
    icon: '',
    bg: '',
  },
};
const mockChainAction = jest.fn();

describe('BlockchainAppDetailsHeader', () => {
  it('displays properly after loading', () => {
    render(
      <BlockchainAppDetailsHeader
        application={application}
        chainAction={
          <div onClick={mockChainAction}>
            <img src="" />
          </div>
        }
        loading={false}
      />
    );
    expect(screen.getByText(appName)).toBeInTheDocument();
    expect(screen.getByText(appAddress)).toBeInTheDocument();
    expect(screen.getByText(appUrl)).toBeInTheDocument();
  });

  it('displays loading screen during loading', () => {
    render(
      <BlockchainAppDetailsHeader
        application={application}
        chainAction={
          <div onClick={mockChainAction}>
            <img src="" />
          </div>
        }
        loading
      />
    );
    expect(screen.getAllByTestId('skeleton-wrapper')).toHaveLength(3);
  });
});
