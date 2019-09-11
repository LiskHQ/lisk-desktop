import React from 'react';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import DialogHolder from '../components/toolbox/dialog/holder';
import AnalyticsMessage from '../components/analyticsMessage/analyticsMessage';
import AnalyticsDialog from '../components/analyticsDialog';

export default {
  init() {
    const onClick = () => { DialogHolder.showDialog(<AnalyticsDialog />); };
    FlashMessageHolder.addMessage(<AnalyticsMessage onClick={onClick} />, 'Analytics');
  },
};
