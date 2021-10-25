import React, { useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { getBlock } from '@api/block';
import withData from '@utils/withData';
import { withTranslation } from 'react-i18next';
import VoteWarning from './voteWarning';
import WarnPunishedDelegate from './warnPunishedDelegate';

const getPunishmentDetails = (punishedTimestamp, pomHeights) => {
  const { start, end } = pomHeights && pomHeights[pomHeights.length - 1];
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  // 10: block slot interval, 60: minutes, 24: hours
  const numOfBlockPerDay = 10 * 60 * 24;
  const daysLeft = Math.ceil((end - start) / numOfBlockPerDay);

  return { daysLeft, punishmentStartDate };
};

const Warning = ({ vote, ...props }) => {
  useEffect(() => {
    props.block.loadData();
  }, []);

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    props.block.data.timestamp,
    props.pomHeights,
  );

  if (vote) {
    return <VoteWarning {...props} daysLeft={daysLeft} />;
  }

  return (
    <WarnPunishedDelegate
      daysLeft={daysLeft}
      punishmentStartDate={punishmentStartDate}
      {...props}
    />
  );
};

const apis = {
  block: {
    apiUtil: (network, params) => getBlock({ network, params }),
    getApiParams: (_, ownProps) => ({
      height: ownProps.pomHeights[ownProps.pomHeights.length - 1]?.start,
    }),
    transformResponse: response => (response.data && response.data[0]),
  },
};

export default compose(
  withRouter,
  withData(apis),
  withTranslation(),
)(Warning);
