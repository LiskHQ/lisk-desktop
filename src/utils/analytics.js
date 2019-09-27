import React from 'react';
import moment from 'moment';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';
import AnalyticsMessage from '../components/shared/analyticsMessage/analyticsMessage';
import AnalyticsDialog from '../components/shared/analyticsDialog';

export default {
  init() {
    const onClick = () => { DialogHolder.showDialog(<AnalyticsDialog />); };
    FlashMessageHolder.addMessage(<AnalyticsMessage onClick={onClick} />, 'Analytics');
  },

  onTriggerPageLoaded({ settings, settingsUpdated }) {
    if (!settings.statistics && settings.statisticsRequest === undefined) {
      settingsUpdated({ statisticsRequest: true });
      const showAnalytics = true;
      this.checkIfAnalyticsShouldBeDisplayed({ settings, showAnalytics });
    }
  },

  checkIfAnalyticsShouldBeDisplayed({ settings, showAnalytics = false }) {
    // showAnalytics - Trigger ONLY the first time when user is in Wallet page after SignIn
    // or show since the beginning after the user saw the banner for first time but
    // didn't took action
    if (showAnalytics
      || (settings.statisticsRequest && settings.statisticsFollowingDay === undefined)
    ) {
      this.init();
    } else { // Will only trigger if user decline and after some days will show up again
      const showRemain = moment().diff(settings.statisticsFollowingDay, 'days') >= 7;
      if (!settings.statistics && showRemain) this.init();
    }
  },
};
