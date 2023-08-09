import { fireEvent, screen, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import useSettings from '@settings/hooks/useSettings';
import { toast } from 'react-toastify';
import {isNetworkUrlSuccess} from "@network/components/DialogAddNetwork/utils";
import DialogAddNetwork from './DialogAddNetwork';

jest.mock('@settings/hooks/useSettings');
const mockSetValue = jest.fn();
useSettings.mockReturnValue({
  setValue: mockSetValue,
  customNetworks: [],
});
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: { info: jest.fn() },
}));

jest.mock('@network/components/DialogAddNetwork/utils', () => ({
  ...jest.requireActual('@network/components/DialogAddNetwork/utils'),
  isNetworkUrlSuccess: jest.fn(() => true),
}));

describe('DialogAddNetwork', () => {
  const config = {
    renderType: 'render',
    historyInfo: {
      goBack: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', () => {
    smartRender(DialogAddNetwork, null, config);

    expect(screen.getAllByText('Add network')[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        '"Lisk" will be the default mainchain application, please enter your custom network to be added to the wallet.'
      )
    ).toBeInTheDocument();
  });

  it('adds a new network if the inputs are valid', async () => {
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'custom_network' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'http://localhost:8080' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add network' }));
    await waitFor(() => {
      expect(toast.info).toBeCalled();
      expect(config.historyInfo.goBack).toBeCalled();
    });
  });

  it('throws errors if the inputs are invalid', async () => {
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: '123*custom&$network' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'localhost:9901' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add network' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid network name')).toBeInTheDocument();
      expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    });
  });

  it('should show retry button if network url fails to fetch', async () => {
    isNetworkUrlSuccess.mockReturnValue(false);
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'test' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'https://www.failedrequest.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add network' }));

    await waitFor(() => {
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });
  });

  it('throws errors if the network name or address already exists', async () => {
    useSettings.mockReturnValue({
      setValue: mockSetValue,
      customNetworks: [
        {
          name: 'custom_network_one',
          label: 'custom_network_one',
          serviceUrl: 'http://custom-network-service.com',
          wsServiceUrl: 'http://custom-network-service.com',
          isAvailable: true,
        },
      ],
    });
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'custom_network_one' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'http://custom-network-service.com' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Name & ServiceUrl & WsServiceUrl already exists.')).toBeInTheDocument();
    });
  });

  it('edits selected network', async () => {
    isNetworkUrlSuccess.mockReturnValue(true);
    useSettings.mockReturnValue({
      setValue: mockSetValue,
      customNetworks: [
        {
          name: 'custom_network_one',
          label: 'custom_network_one',
          serviceUrl: 'http://custom-network-service.com',
          isAvailable: true,
        },
      ],
    });
    const updatedConfig = {
      ...config,
      historyInfo: {
        goBack: jest.fn(),
        location: {
          search:
            'modal=dialogAddNetwork&name=custom_network_one&serviceUrl=http://custom-network-service.com',
        },
      },
    };
    smartRender(DialogAddNetwork, null, updatedConfig);

    expect(screen.getByText('Edit network')).toBeInTheDocument();
    expect(screen.getByText('Save network')).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'custom_network_new' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'http://localhost:7878' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(toast.info).toBeCalled();
      expect(updatedConfig.historyInfo.goBack).toBeCalled();
    });
  });
});
