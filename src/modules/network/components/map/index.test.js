import React from 'react';
import { mount } from 'enzyme';
import L from 'leaflet';
import peers from '@tests/constants/peers';
import Map from './index';

const LeafletMock = jest.genMockFromModule('leaflet');

class Map1 extends LeafletMock.Map {
  constructor(id, options = {}) {
    super();
    Object.assign(this, L.Evented.prototype);

    this.options = { ...L.Map.prototype.options, ...options };
    this._container = id;

    if (options.bounds) {
      this.fitBounds(options.bounds, options.boundsOptions);
    }

    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds);
    }

    if (options.center && options.zoom !== undefined) {
      this.setView(L.latLng(options.center), options.zoom);
    }
  }

  _limitZoom(zoom) {
    const min = this.getMinZoom();
    const max = this.getMaxZoom();
    return Math.max(min, Math.min(max, zoom));
  }

  _resetView(center, zoom) {
    this._initialCenter = center;
    this._zoom = zoom;
  }

  fitBounds(bounds, options) {
    this._bounds = bounds;
    this._boundsOptions = options;
  }

  getBounds() {
    return this._bounds;
  }

  getCenter() {
    return this._initialCenter;
  }

  getMaxZoom() {
    return this.options.maxZoom === undefined ? Infinity : this.options.maxZoom;
  }

  getMinZoom() {
    return this.options.minZoom === undefined ? 0 : this.options.minZoom;
  }

  getZoom() {
    return this._zoom;
  }

  setMaxBounds(bounds) {
    bounds = L.latLngBounds(bounds);
    this.options.maxBounds = bounds;
    return this;
  }

  setView(center, zoom) {
    zoom = zoom === undefined ? this.getZoom() : zoom;
    this._resetView(L.latLng(center), this._limitZoom(zoom));
    return this;
  }

  setZoom(zoom) {
    return this.setView(this.getCenter(), zoom);
  }
}

describe('Map view', () => {
  jest.mock('leaflet', () => ({
    map: (id, options) => new Map1(id, options),
    tileLayer: jest.fn(),
  }));

  it('Renders the map correctly', () => {
    // @todo Fix failing test with Map component
    const div = global.document.createElement('div');
    global.document.body.appendChild(div);

    const wrapper = mount(<Map peers={peers} />, { attachTo: div });

    // map called, tiles added, layer added with peer list, attributionControl called
    expect(wrapper).toBeVisible();
    expect(L.map).toHaveBeenCalled();
    expect(L.tileLayer).toHaveBeenCalled();
    expect(L.addLayer).toHaveBeenCalledWith();
  });
});
