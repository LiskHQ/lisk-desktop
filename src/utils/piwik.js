import ReactPiwik from 'react-piwik';
import piwikOptions from '../constants/piwik';

let piwikInstance = false;

const setPiwikParameters = () => {
  ReactPiwik.push([piwikOptions.REMEMBER_CONSENT_GIVEN]);
  ReactPiwik.push([piwikOptions.ENABLE_HEART_BEAT_TIMER, 30]);
  ReactPiwik.push([piwikOptions.SET_GENERATATION_TIME_MS, 25000]);
  ReactPiwik.push([piwikOptions.TRACK_PAGE_VIEW]);
  ReactPiwik.push([piwikOptions.ENABLE_LINK_TRACKING]);
  ReactPiwik.push([piwikOptions.TRACK_ALL_CONTENT_IMPRESSIONS]);
};

const initPiwik = () => {
  const piwik = new ReactPiwik({
    url: piwikOptions.URL,
    siteId: piwikOptions.SITE_ID,
    trackErrors: true,
  });

  setPiwikParameters();

  return piwik;
};

const disabledPiwikTracking = () => {
  ReactPiwik.push([piwikOptions.FORGET_CONSENT_GIVEN]);
};

const trackingEvent = (category, action, name) => {
  if (piwikInstance) ReactPiwik.push([piwikOptions.TRACK_EVENT, category, action, name]);
};

const tracking = (history, settings) => {
  if (!piwikInstance && settings.statistics) {
    piwikInstance = initPiwik();
  }

  if (piwikInstance && settings.statistics) {
    ReactPiwik.push([piwikOptions.REMEMBER_CONSENT_GIVEN]);
    piwikInstance.connectToHistory(history);
  } else if (piwikInstance) {
    disabledPiwikTracking();
  }
};

export default {
  tracking,
  trackingEvent,
};
