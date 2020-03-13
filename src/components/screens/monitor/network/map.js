import React, { useEffect } from 'react';
import styles from './network.css';

const setCenter = (google, position) => new google.LatLng(position.lat, position.lng);

const createMap = (google, center, container) => {
  const options = {
    zoom: 16,
    draggable: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    panControl: false,
    fullscreenControl: false,
    center,
  };

  return new google.Map(container, options);
};

const createMarker = (google, center, map, name) => {
  const marker = new google.Marker({
    position: center,
    animation: google.Animation.DROP,
    title: typeof name === 'string' && name.length ? name : null,
  });
  return marker.setMap(map);
};

const mountGoogleMap = (position, container, name) => {
  const google = window.google.maps;
  const center = setCenter(google, position);
  const map = createMap(google, center, container);
  const marker = createMarker(google, center, map, name);
  return {
    google, center, map, marker,
  };
};

const Map = ({ peers }) => {
  if (!peers.length) return null;

  const position = {
    lat: peers[0].location.latitude,
    lng: peers[0].location.longitude,
  };
  let container;
  let mapInfo = {};

  useEffect(() => {
    if (window && window.google) {
      mapInfo = mountGoogleMap(position, container);
    }

    return () => {
      delete mapInfo.marker;
      delete mapInfo.center;
      delete mapInfo.map;
      delete mapInfo.google;
    };
  }, [position]);

  return (
    <div className={styles.map}>
      <div className={styles.wrapper}>
        <div
          className={styles.container}
          id="map-container"
          ref={(el) => {
            container = el;
          }}
        />
      </div>
    </div>
  );
};

export default Map;
