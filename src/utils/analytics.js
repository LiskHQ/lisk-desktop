import React from 'react';
import moment from 'moment';
import FlashMessageHolder from 'src/theme/flashMessage/holder';
import AnalyticsMessage from 'src/modules/common/components/analyticsMessage/analyticsMessage';

export default {
  init() {
    FlashMessageHolder.addMessage(<AnalyticsMessage />, 'Analytics');
  },

  onTriggerPageLoaded({ settings, settingsUpdated }) {
    if (!settings.statistics && settings.statisticsRequest === undefined) {
      settingsUpdated({ statisticsRequest: true });
      const showAnalytics = true;
      this.checkIfAnalyticsShouldBeDisplayed({ settings, showAnalytics });
    }
  },

  checkIfAnalyticsShouldBeDisplayed({
    statistics,
    statisticsRequest,
    statisticsFollowingDay,
    showAnalytics = false,
  }) {
    // showAnalytics - Trigger ONLY the first time when user is in Wallet page after SignIn
    // or show since the beginning after the user saw the banner for first time but
    // didn't took action
    if (showAnalytics || (statisticsRequest && statisticsFollowingDay === undefined)) {
      this.init();
    } else {
      // Will only trigger if user decline and after some days will show up again
      const showRemain = moment().diff(statisticsFollowingDay, 'days') >= 7;
      if (!statistics && showRemain) this.init();
    }
  },
};
