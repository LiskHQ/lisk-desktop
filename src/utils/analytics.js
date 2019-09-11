import React from 'react';
import moment from 'moment';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';
import AnalyticsMessage from '../components/analyticsMessage/analyticsMessage';
import AnalyticsDialog from '../components/analyticsDialog';

export default {
  init() {
    const onClick = () => { DialogHolder.showDialog(<AnalyticsDialog />); };
    FlashMessageHolder.addMessage(<AnalyticsMessage onClick={onClick} />, 'Analytics');
  },

  checkIfAnalyticsShouldBeDisplay({ settings, showAnalytics = false }) {
    // Trigger first time when is SignIn and Wallet page
    if (showAnalytics) this.init();

    // Show all the time if user didn't accept/cancel
    if (!showAnalytics
        && settings.statisticsRequest
        && settings.statisticsFollowingDay === undefined
    ) {
      this.init();
    }

    // Show up again after 7 days
    if (!showAnalytics
      && settings.statisticsRequest
      && settings.statisticsFollowingDay
    ) {
      const showRemain = (moment().dayOfYear() - settings.statisticsFollowingDay) >= 7;
      if (!settings.statistics && showRemain) this.init();
    }
  },
};
