import piwikConfig from '../constants/piwik';

class Piwik {
  constructor(opts) {
    const options = opts;

    options.enableLinkTracking = (options.enableLinkTracking !== undefined) ?
      options.enableLinkTracking :
      true;

    options.trackDocumentTitle = (options.trackDocumentTitle !== undefined) ?
      options.trackDocumentTitle :
      true;

    options.jsFilename = (options.jsFilename !== undefined) ?
      options.jsFilename :
      'piwik.js';

    options.phpFilename = (options.phpFilename !== undefined) ?
      options.phpFilename :
      'piwik.php';

    this.options = options;

    if (this.options.url === undefined || this.options.siteId === undefined) {
      throw new Error('PiwikTracker cannot be initialized! SiteId and url are mandatory.');
    }

    this.initPiwik();
  }

  initPiwik() { // eslint-disable-line max-statements
    if (typeof window !== 'undefined') {
      let url = this.options.url;

      if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
        url = `${url}/`;
      } else {
        url = ((document.location.protocol === 'https:') ? `https://${url}/` : `http://${url}/`);
      }

      window._paq = window._paq || [];

      Piwik.push([piwikConfig.SET_SITE_ID, this.options.siteId]);
      Piwik.push([piwikConfig.SET_TRACKER_URL, `${url + this.options.phpFilename}`]);

      if (this.options.enableLinkTracking) {
        Piwik.push([piwikConfig.ENABLE_LINK_TRACKING]);
      }

      const scriptElement = document.createElement('script');
      const refElement = document.getElementsByTagName('script')[0];

      scriptElement.type = 'text/javascript';
      scriptElement.defer = true;
      scriptElement.async = true;

      let jsFilename = this.options.jsFilename;

      if (jsFilename.indexOf('http://') !== 0 && jsFilename.indexOf('https://') !== 0) {
        jsFilename = url + jsFilename;
      }

      scriptElement.src = jsFilename;
      refElement.parentNode.insertBefore(scriptElement, refElement);
    }

    return {
      push: this.push,
      track: this.track,
      connectToHistory: this.connectToHistory,
      disconnectFromHistory: this.disconnectFromHistory,
      setUserId: this.setUserId,
    };
  }

  static push(args) {
    window._paq.push(args);
  }

  static setUserId(userId) {
    Piwik.push([piwikConfig.SET_USER_ID, userId]);
    Piwik.push([piwikConfig.TRACK_PAGE_VIEW]);
  }

  static removeUserId() {
    Piwik.push([piwikConfig.RESET_USER_ID]);
    Piwik.push([piwikConfig.TRACK_PAGE_VIEW]);
  }

  connectToHistory(history) {
    const prevLoc = (typeof history.getCurrentLocation === 'undefined') ?
      history.location :
      history.getCurrentLocation();

    this.previousPath = prevLoc.path || (prevLoc.pathname + prevLoc.search).replace(/^\//, '');
    this.unlistenFromHistory = history.listen((loc) => { this.track(loc); });
    return true;
  }

  disconnectFromHistory() {
    if (this.unlistenFromHistory) {
      this.unlistenFromHistory();
      return true;
    }
    return false;
  }

  track(loc) {
    if (typeof window === 'undefined') return;

    const currentPath = loc.path || (loc.pathname + loc.search).replace(/^\//, '');

    if (this.previousPath === currentPath) return;

    if (this.options.trackDocumentTitle) {
      Piwik.push([piwikConfig.SET_DOCUMENT_TITLE, document.title]);
    }

    if (this.previousPath) {
      Piwik.push([piwikConfig.SET_REFERRER_URL, `${window.location.origin}/${this.previousPath}`]);
    }
    Piwik.push([piwikConfig.SET_CUSTOM_URL, `${window.location.origin}/${currentPath}`]);
    Piwik.push([piwikConfig.TRACK_PAGE_VIEW]);
    this.previousPath = currentPath;
  }
}

export default Piwik;
