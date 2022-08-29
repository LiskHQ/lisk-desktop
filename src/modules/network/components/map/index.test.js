import React from 'react';
import { mount } from 'enzyme';
import peers from '@tests/constants/peers';
import Map from './index';
import { mockPeers } from '../../__fixtures__';
import { usePeers } from '../../hooks/queries';

jest.mock('../../hooks/queries');

const mockAddLayer = jest.fn();
const mockAddAttribution = jest.fn();
const networkMap = {
  addLayer: mockAddLayer,
  attributionControl: {
    addAttribution: mockAddAttribution,
  },
};

const mockAddTo = jest.fn();
const mockSetView = jest.fn().mockReturnValue(networkMap);

jest.mock('leaflet', () => ({
  map: () => ({
    setView: mockSetView,
  }),
  tileLayer: () => ({
    addTo: mockAddTo,
  }),
  icon: jest.fn(),
  divIcon: jest.fn(),
  setView: jest.fn(),
  marker: jest.fn(),
  markerClusterGroup: () => ({
    addLayer: mockAddLayer,
  }),
}));
jest.mock('leaflet.markercluster/dist/leaflet.markercluster', () => ({}));

describe('Map view', () => {
  it('Renders the map correctly', () => {
    usePeers.mockReturnValue({
      data: mockPeers,
      isLoading: false,
      isFetching: false,
    });

    mount(<Map />);

    expect(mockSetView).toBeCalled();
    expect(mockAddTo).toBeCalledWith(networkMap);
    expect(mockAddLayer).toHaveBeenCalledTimes(peers.length + 1);
    expect(mockAddAttribution).toBeCalled();
  });
});
