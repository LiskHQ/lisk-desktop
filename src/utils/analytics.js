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

  checkIfAnalyticsShouldBeDisplayed({ settings, showAnalytics = false }) {
    if (showAnalytics
      || (!showAnalytics
          && settings.statisticsRequest
          && settings.statisticsFollowingDay === undefined)
    ) {
      this.init();
    } else {
      const showRemain = moment().diff(settings.statisticsFollowingDay, 'days') >= 7;
      if (!settings.statistics && showRemain) this.init();
    }
  },
};
