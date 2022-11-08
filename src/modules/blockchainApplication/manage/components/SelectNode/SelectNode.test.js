import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockBlockChainApplications, { applicationsMap } from '@tests/fixtures/blockchainApplicationsManage';
import SelectNode from './SelectNode';

const mockSetCurrentApplication = jest.fn();
const mockSetCurrentNode = jest.fn();
const mockCurrentApplication = mockBlockChainApplications[0];

const mockDispatch = jest.fn();
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

jest.mock('../../hooks/useCurrentNode', () => ({
  useCurrentNode: () => ({
    setCurrentNode: mockSetCurrentNode,
  }),
}));
jest.mock('../../hooks/useCurrentApplication', () => ({
  useCurrentApplication: () => ([mockCurrentApplication, mockSetCurrentApplication]),
}));

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
  it('Should render select node component', () => {
    const selectedApplication = { ...mockBlockChainApplications[4], isPinned: false };

    renderWithRouterAndQueryClient(SelectNode, props);
    expect(screen.getByText('Kalipo')).toBeTruthy();
    expect(screen.getByText('Choose application URL')).toBeTruthy();
    expect(screen.getAllByTestId('application-node-row')).toHaveLength(2);
    fireEvent.click(screen.getAllByTestId('application-node-row')[0]);
    expect(mockSetCurrentApplication).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentApplication).toHaveBeenCalledWith(selectedApplication);
    expect(mockSetCurrentNode).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentNode).toHaveBeenCalledWith(mockBlockChainApplications[4].serviceURLs[0]);
  });
});
