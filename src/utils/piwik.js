import ReactPiwik from 'react-piwik';
import piwikOptions from '../constants/piwik';
import localJSONStorage from './localJSONStorage';

let piwik = false;
let piwikSetAlready = false;

const setPiwikParameters = () => {
  ReactPiwik.push([piwikOptions.REQUIRE_CONSENT]);
  ReactPiwik.push([piwikOptions.ENABLE_HEART_BEAT_TIMER, 30]);
  ReactPiwik.push([piwikOptions.TRACK_PAGE_VIEW]);
  ReactPiwik.push([piwikOptions.TRACK_ALL_CONTENT_IMPRESSIONS]);
};

const initPiwik = () => {
  piwik = new ReactPiwik({
    url: piwikOptions.URL,
    siteId: piwikOptions.SITE_ID,
    trackErrors: true,
  });

  setPiwikParameters();
  return piwik;
};

const checkIfPiwikIsEnable = () => {
  const isPiwikSet = localJSONStorage.get('statistics', false);

  if (isPiwikSet && !piwik && !piwikSetAlready) {
    initPiwik();
    piwikSetAlready = true;
  }
};

const disabledPiwikTracking = () => {
  ReactPiwik.push([piwikOptions.FORGET_CONSENT_GIVEN]);
};

const connectPiwikWithHistory = (history) => {
  checkIfPiwikIsEnable();

  if (piwik) {
    piwik.connectToHistory(history);
  }

  return piwik;
};

export default {
  connectPiwikWithHistory,
  disabledPiwikTracking,
};
