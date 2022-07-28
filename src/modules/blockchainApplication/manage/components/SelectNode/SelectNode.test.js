import { screen, fireEvent } from '@testing-library/react';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import mockBlockChainApplications from '@tests/fixtures/blockchainApplicationsManage';
import SelectNode from './SelectNode';

const mockSetCurrentNode = jest.fn();
const mockCurrentApplication = mockBlockChainApplications[0];

jest.mock('../../hooks/useCurrentNode', () => jest.fn(() => ({
  setCurrentNode: mockSetCurrentNode,
})));
jest.mock('../../hooks/useCurrentApplication', () => ({
  useCurrentApplication: () => ([mockCurrentApplication]),
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
  it('displays properly', () => {
    renderWithCustomRouter(SelectNode, props);
    expect(screen.getByText('Kalipo')).toBeTruthy();
    expect(screen.getByText('Choose application URL')).toBeTruthy();
    expect(screen.getAllByTestId('application-node-row')).toHaveLength(2);
    fireEvent.click(screen.getAllByTestId('application-node-row')[0]);
    expect(mockSetCurrentNode).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentNode).toHaveBeenCalledWith(mockBlockChainApplications[4].apis[0]);
  });
});
