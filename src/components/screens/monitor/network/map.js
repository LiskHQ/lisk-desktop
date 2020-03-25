import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import styles from './network.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import markerIcon from '../../../../assets/images/marker.svg';

const createMarkers = (peers) => {
  const icon = L.icon({
    iconUrl: markerIcon,
    iconSize: [42, 42],
  });

  const markers = L.markerClusterGroup({
    iconCreateFunction: cluster =>
      L.divIcon({ html: `<b class="markerCluster">${cluster.getChildCount()}</b>` }),
  });

  peers.forEach((peer) => {
    if (peer.location.latitude) {
      markers.addLayer(
        L.marker([peer.location.latitude, peer.location.longitude], { icon }),
      );
    }
  });

  return markers;
};

const getTiles = () =>
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
  });

const FullMap = ({ peers }) => {
  const ref = useRef();

  useEffect(() => {
    if (peers.length && !ref.map) {
      const networkMap = L.map('mapContainer').setView([36.414203, 11.250000], 2);

      const tiles = getTiles();
      tiles.addTo(networkMap);

      networkMap.addLayer(createMarkers(peers));
      ref.current = networkMap;
    }
  }, [peers]);

  useEffect(() => () => {
    ref.current.remove();
  }, []);

  return (
    <div className={styles.map}>
      <div className={styles.wrapper}>
        <div id="mapContainer" />
      </div>
    </div>
  );
};

export default FullMap;
