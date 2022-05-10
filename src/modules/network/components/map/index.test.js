import React from 'react';
import { mount } from 'enzyme';
import peers from '@tests/constants/peers';
import Map from './index';

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
    mount(<Map peers={peers} />);
    expect(mockSetView).toBeCalled();
    expect(mockAddTo).toBeCalledWith(networkMap);
    expect(mockAddLayer).toHaveBeenCalledTimes(peers.length + 1);
    expect(mockAddAttribution).toBeCalled();
  });
});
