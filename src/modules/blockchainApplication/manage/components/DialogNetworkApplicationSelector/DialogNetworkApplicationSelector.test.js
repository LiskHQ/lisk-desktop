import { screen } from '@testing-library/react';
import useSettings from '@settings/hooks/useSettings';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import networks from '@network/configuration/networks';
import { DEFAULT_NETWORK } from 'src/const/config';
import DialogNetworkApplicationSelector from './DialogNetworkApplicationSelector';

jest.mock('@settings/hooks/useSettings');
jest.mock('src/utils/searchParams');

useSettings.mockReturnValue({
  customNetworks: [],
  mainChainNetwork: networks[DEFAULT_NETWORK],
  setValue: jest.fn(),
});

describe('ModalNetworkApplicationSelector', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndQueryClient(DialogNetworkApplicationSelector, props);
  });

  it('should display properly', () => {
    Object.keys(networks)
      .filter((networkKey) => networks[networkKey].isAvailable)
      .forEach((availableNetwork) => {
        const { label } = networks[availableNetwork];
        expect(screen.getAllByText(label)).toBeTruthy();
      });
  });
});
