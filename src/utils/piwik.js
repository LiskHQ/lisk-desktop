import ReactPiwik from 'react-piwik';
import piwikOptions from '../constants/piwik';

const piwik = new ReactPiwik({
  url: piwikOptions.URL,
  siteId: piwikOptions.SITE_ID,
  trackErrors: true,
});

const initPiwik = () => piwik;
const setPiwikParameters = () => {
  ReactPiwik.push([piwikOptions.ENABLE_HEART_BEAT_TIMER, 30]);
  ReactPiwik.push([piwikOptions.TRACK_PAGE_VIEW]);
  ReactPiwik.push([piwikOptions.TRACK_ALL_CONTENT_IMPRESSIONS]);
};

export default {
  initPiwik,
  setPiwikParameters,
};
