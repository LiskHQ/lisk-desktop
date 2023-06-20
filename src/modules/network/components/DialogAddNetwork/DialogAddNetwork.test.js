import { screen, fireEvent, waitFor } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import useSettings from '@settings/hooks/useSettings';
import DialogAddNetwork from './DialogAddNetwork';

jest.mock('@settings/hooks/useSettings');

describe('DialogAddNetwork', () => {
  const config = {
    renderType: 'render',
    historyInfo: {},
  };
  const mockSetValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders properly', () => {
    useSettings.mockReturnValue({
      setValue: mockSetValue,
      customNetworks: [],
    });
    smartRender(DialogAddNetwork, null, config);

    expect(screen.getAllByText('Add network')[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        '"Lisk" will be the default mainchain application, please enter your custom network to be added to the wallet.'
      )
    ).toBeInTheDocument();
  });

  it('adds a new network if the inputs are valid', async () => {
    useSettings.mockReturnValue({
      setValue: mockSetValue,
      customNetworks: [],
    });
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'custom_network' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'http://localhost:9901' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Success: Network added')).toBeInTheDocument();
    });
  });

  it('throws errors if the inputs are invalid', async () => {
    useSettings.mockReturnValue({
      setValue: mockSetValue,
      customNetworks: [],
    });
    smartRender(DialogAddNetwork, null, config);

    fireEvent.change(screen.getByTestId('name'), { target: { value: '123*custom&$network' } });
    fireEvent.change(screen.getByTestId('serviceUrl'), {
      target: { value: 'localhost:9901' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Invalid Network Name')).toBeInTheDocument();
      expect(screen.getByText('Invalid URL')).toBeInTheDocument();
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
      expect(screen.getByText('Network name or serviceUrl already exists')).toBeInTheDocument();
    });
  });

  it('edits selected network', async () => {
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
    const updatedConfig = {
      ...config,
      historyInfo: {
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
      target: { value: 'http://localhost:9901' },
    });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Success: Network edited')).toBeInTheDocument();
    });
  });
});
