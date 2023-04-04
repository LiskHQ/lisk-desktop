import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import { mockBlockchainAppMeta } from '../../__fixtures__';
import RemoveApplicationSuccess from './RemoveApplicationSuccess';

describe('BlockchainApplicationDetails', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
    sharedData: { application: mockBlockchainAppMeta.data[0] },
  };
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(RemoveApplicationSuccess, props);
  });

  it('should display properly', () => {
    const { chainName } = props.sharedData.application;

    expect(screen.getByText('Application has now been removed')).toBeTruthy();
    expect(screen.getByText(chainName)).toBeTruthy();
  });

  it('should navigate to the wallet', () => {
    fireEvent.click(screen.getByText('Continue to wallet'));
    expect(props.history.push).toHaveBeenCalledWith('/wallet');
  });
});
