import { screen, fireEvent, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import useSettings from '@settings/hooks/useSettings';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { toast } from 'react-toastify';
import DialogRemoveNetwork from './DialogRemoveNetwork';

jest.mock('@settings/hooks/useSettings');
jest.mock('src/utils/searchParams', () => ({
  ...jest.requireActual('src/utils/searchParams.js'),
  removeSearchParamsFromUrl: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: { info: jest.fn(), error: jest.fn() },
}));

const mockSetValue = jest.fn();
const config = {
  renderType: 'render',
  historyInfo: {
    location: {
      search: {
        name: 'custom_beta_network',
        serviceUrl: 'https://custom-betanet-service.com',
      },
    },
  },
};

const customNetworks = [
  {
    name: 'custom_beta_network',
    label: 'custom_beta_network',
    serviceUrl: 'https://custom-betanet-service.com',
    wsServiceUrl: 'https://custom-betanet-service.com',
    isAvailable: true,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DialogRemoveNetwork', () => {
  it('renders properly', () => {
    useSettings.mockReturnValue({
      customNetworks,
      mainChainNetwork: { name: 'betanet' },
      setValue: mockSetValue,
    });
    smartRender(DialogRemoveNetwork, null, config);

    expect(screen.getByText('Remove network?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This network will no longer be stored on this device and will have to be added again to use.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Remove network')).toBeInTheDocument();
    expect(screen.getByText('Cancel remove')).toBeInTheDocument();
  });

  it('cancels and closes the modal if the cancel button is clicked', async () => {
    useSettings.mockReturnValue({
      customNetworks,
      mainChainNetwork: { name: 'betanet' },
      setValue: mockSetValue,
    });
    smartRender(DialogRemoveNetwork, null, config);

    expect(screen.getByText('Cancel remove')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel remove'));
    await waitFor(() => {
      expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
    });
  });

  it('removes the network if the confirm button is clicked', async () => {
    useSettings.mockReturnValue({
      customNetworks,
      mainChainNetwork: { name: 'betanet' },
      setValue: mockSetValue,
    });
    const updatedConfig = {
      ...config,
      historyInfo: {
        location: {
          search:
            'modal=dialogRemoveNetwork&name=custom_beta_network&serviceUrl=https://custom-betanet-service.com',
        },
      },
    };
    smartRender(DialogRemoveNetwork, null, updatedConfig);

    expect(screen.getByText('Remove network')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove network'));
    await waitFor(() => {
      expect(removeSearchParamsFromUrl).toBeCalledTimes(1);
      expect(toast.info).toBeCalledWith(`Network removed "custom_beta_network"`, {
        position: 'bottom-right',
      });
    });
  });

  it('displays an error if user tries to remove the currently connected custom network', async () => {
    useSettings.mockReturnValue({
      customNetworks,
      mainChainNetwork: { name: 'custom_beta_network' },
      setValue: mockSetValue,
    });
    const updatedConfig = {
      ...config,
      historyInfo: {
        location: {
          search:
            'modal=dialogRemoveNetwork&name=custom_beta_network&serviceUrl=https://custom-betanet-service.com',
        },
      },
    };
    smartRender(DialogRemoveNetwork, null, updatedConfig);

    expect(screen.getByText('Remove network')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove network'));
    await waitFor(() => {
      expect(toast.error).toBeCalledWith(`Error: Can't delete current network`, {
        position: 'bottom-right',
      });
    });
  });
});
