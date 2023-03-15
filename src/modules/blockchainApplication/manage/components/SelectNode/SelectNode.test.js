import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import useSettings from '@settings/hooks/useSettings';
import mockBlockChainApplications, {
  applicationsMap,
} from '@tests/fixtures/blockchainApplicationsManage';
import SelectNode from './SelectNode';

const mockSetCurrentApplication = jest.fn();
const mockCurrentApplication = mockBlockChainApplications[0];

const mockDispatch = jest.fn();
const mockToggleSetting = jest.fn();
const mockState = {
  blockChainApplications: {
    applications: applicationsMap,
    pins: [],
  },
};
jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockImplementation((fn) => fn(mockState)),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../hooks/useCurrentApplication', () => ({
  useCurrentApplication: () => [mockCurrentApplication, mockSetCurrentApplication],
}));
jest.mock('@settings/hooks/useSettings');

const props = {
  history: {
    location: {
      search: '?modal=selectNode&chainId=aq25derd17a4syc8aet3pryt',
    },
    push: jest.fn(),
  },
  location: {
    search: '?modal=selectNode&chainId=aq25derd17a4syc8aet3pryt',
  },
};

describe('SelectNode', () => {
  useSettings.mockReturnValue({
    mainChainNetwork: { name: 'devnet' },
    toggleSetting: mockToggleSetting,
  });

  it('Should render select node component', () => {
    const selectedApplication = { ...mockBlockChainApplications[4], isPinned: false };

    renderWithRouterAndQueryClient(SelectNode, props);
    expect(screen.getByText('Kalipo')).toBeTruthy();
    expect(screen.getByText('Choose application URL')).toBeTruthy();
    expect(screen.getAllByTestId('application-node-row')).toHaveLength(2);
    fireEvent.click(screen.getAllByTestId('application-node-row')[0]);
    expect(mockSetCurrentApplication).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentApplication).toHaveBeenCalledWith(
      selectedApplication,
      mockBlockChainApplications[4].serviceURLs[0]
    );
  });
});
