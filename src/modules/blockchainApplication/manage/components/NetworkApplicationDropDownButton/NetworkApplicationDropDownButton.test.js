import { fireEvent, screen } from '@testing-library/react';
import mockManagedApplications from '@tests/fixtures/blockchainApplicationsManage';
import { renderWithRouter } from 'src/utils/testHelpers';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import useSettings from '@settings/hooks/useSettings';
import NetworkApplicationDropDownButton from './NetworkApplicationDropDownButton';
import { useCurrentApplication } from '../../hooks/useCurrentApplication';

jest.mock('@blockchainApplication/manage/hooks/useCurrentApplication');
jest.mock('src/utils/searchParams');
jest.mock('@settings/hooks/useSettings');

const mockSetApplication = jest.fn();
const mockCurrentApplication = mockManagedApplications[1];

useCurrentApplication.mockReturnValue([mockCurrentApplication, mockSetApplication]);
useSettings.mockReturnValue({
  mainChainNetwork: { name: 'devnet', isAvailable: true },
});

describe('NetworkApplicationDropDownButton', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
    location: { pathname: '' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(NetworkApplicationDropDownButton, props);
  });

  it('should display properly', () => {
    expect(screen.getByText(mockCurrentApplication.chainName)).toBeTruthy();
    expect(screen.queryByAltText('dropdownArrowIcon')).toBeTruthy();
  });

  it('should show the manage application list popup', () => {
    fireEvent.click(screen.getByText(mockCurrentApplication.chainName));
    expect(addSearchParamsToUrl).toHaveBeenCalledWith(props.history, {
      modal: 'manageApplications',
    });
  });
});
