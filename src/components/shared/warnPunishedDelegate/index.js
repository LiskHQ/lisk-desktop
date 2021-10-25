import React, { useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { getBlock } from '@api/block';
import withData from '@utils/withData';
import { withTranslation } from 'react-i18next';
import VoteWarning from './voteWarning';
import WarnPunishedDelegate from './warnPunishedDelegate';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length ? state.blocks.latestBlocks[0].height : 0,
});

const getPunishmentDetails = (punishedTimestamp, pomHeights, currentHeight) => {
  const { end } = pomHeights && pomHeights[pomHeights.length - 1];
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  // 6: blocks per minute, 60: minutes, 24: hours
  const numOfBlockPerDay = 24 * 60 * 6;
  const daysLeft = Math.ceil((end - currentHeight) / numOfBlockPerDay);

  return { daysLeft, punishmentStartDate };
};

const Warning = ({ vote, ...props }) => {
  useEffect(() => {
    props.block.loadData();
  }, []);

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    props.block.data.timestamp,
    props.pomHeights,
    props.currentHeight,
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
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Warning);
