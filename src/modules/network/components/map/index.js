import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import markerIcon from '@setup/react/assets/images/marker.svg';
import mapboxWatermarkImage from '@setup/react/assets/images/mapbox.png';
import Empty from 'src/theme/table/empty';
import styles from './map.css';
import { usePeers } from '../../hooks/queries';

const mapOptions = {
  minZoom: 2,
  maxZoom: 12,
  zoom: 2,
  zoomControl: true,
};

const createMarkers = (peers) => {
  const icon = L.icon({
    iconUrl: markerIcon,
    iconSize: [42, 42],
  });

  const markers = L.markerClusterGroup({
    iconCreateFunction: (cluster) =>
      L.divIcon({
        html: `<b class="markerCluster">${cluster.getChildCount()}</b>`,
      }),
  });

  peers.forEach((peer) => {
    if (peer.location?.latitude) {
      markers.addLayer(L.marker([peer.location.latitude, peer.location.longitude], { icon }));
    }
  });

  return markers;
};

const getAttributionLinks = () => {
  const openStreetMap =
    '<span>© <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> contributors</span>';
  const mapBox =
    '<a href="https://www.mapbox.com/about/maps/" rel="noopener noreferrer" target="_blank">© Mapbox</a>';
  const improveThisMap =
    '<a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10" rel="noopener noreferrer" target="_blank">Improve this map</a>';
  const watermark = `<a href="https://www.mapbox.com/about/maps" rel="noopener noreferrer" target="_blank"><img src="${mapboxWatermarkImage}" class="mapboxWatermark"  alt=""/></a>`;

  return `${openStreetMap} ${mapBox} ${improveThisMap} ${watermark}`;
};

const getTiles = () =>
  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${REACT_APP_MAPBOX_ACCESS_TOKEN}`,
    {
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
    }
  );

const FullMap = () => {
  const mapInstanceRef = useRef();
  const [peersCount, setPeersCount] = useState(0);
  const { data, isLoading, error } = usePeers();

  const peers = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    // eslint-disable-next-line no-constant-condition
    if (peers.length) {
      if (!mapInstanceRef.current) {
        const networkMap = L.map('mapContainer', mapOptions).setView([36.414203, 11.25], 2);
        const tiles = getTiles();
        tiles.addTo(networkMap);
        mapInstanceRef.current = networkMap;
      }

      mapInstanceRef.current.addLayer(createMarkers(peers.slice(peersCount)));
      mapInstanceRef.current.attributionControl.addAttribution(getAttributionLinks());
      setPeersCount(peers.length);
    }
  }, [peers]);

  useEffect(() => () => mapInstanceRef?.current?.remove?.(), []);

  return (
    <Box className="map-box">
      <BoxContent className={styles.mapWrapper}>
        <div className={styles.map}>
          <div className={styles.wrapper}>
            <div id="mapContainer" />
            <Empty
              data={{ illustration: 'emptyConnectedPeersIllustration' }}
              error={error}
              isLoading={isLoading}
              isListEmpty={peers.length !== 0}
            />
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default FullMap;
