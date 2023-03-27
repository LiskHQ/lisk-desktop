import { fireEvent, screen } from '@testing-library/react';
import mockBlockchainApplications from '@tests/fixtures/blockchainApplicationsExplore';
import { renderWithRouter } from 'src/utils/testHelpers';
import RemoveApplicationSuccess from './RemoveApplicationSuccess';

describe('BlockchainApplicationDetails', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
    sharedData: { application: { data: mockBlockchainApplications[0] } },
  };
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(RemoveApplicationSuccess, props);
  });

  it('should display properly', () => {
    const { chainName } = props.sharedData.application.data;

    expect(screen.getByText('Application has now been removed')).toBeTruthy();
    expect(screen.getByText(chainName)).toBeTruthy();
  });

  it('should navigate to the dashboard', () => {
    fireEvent.click(screen.getByText('Continue to dashboard'));
    expect(props.history.push).toHaveBeenCalledWith('/dashboard');
  });
});
