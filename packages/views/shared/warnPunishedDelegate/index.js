import React, { useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { getBlock } from '@block/api';
import withData from '@common/utilities/withData';
import { withTranslation } from 'react-i18next';
import VoteWarning from './voteWarning';
import WarnPunishedDelegate from './warnPunishedDelegate';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length ? state.blocks.latestBlocks[0].height : 0,
});

const getPunishmentDetails = (punishedTimestamp, pomHeight, currentHeight) => {
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  // 6: blocks per minute, 60: minutes, 24: hours
  const numOfBlockPerDay = 24 * 60 * 6;
  const daysLeft = Math.ceil((pomHeight.end - currentHeight) / numOfBlockPerDay);
  return { daysLeft, punishmentStartDate };
};

const Warning = ({ vote, ...props }) => {
  useEffect(() => {
    if (props.pomHeight.start) {
      props.block.loadData();
    }
  }, [props.pomHeight.start]);

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    props.block.data.timestamp,
    props.pomHeight,
    props.currentHeight,
  );

  if (vote) {
    return <EditVoteWarning daysLeft={daysLeft} {...props} />;
  }

  return (
    <DelegateProfileWarning
      daysLeft={daysLeft}
      punishmentStartDate={punishmentStartDate}
      {...props}
    />
  );
};

export const DelegateProfileWarning = ({ daysLeft, punishmentStartDate, ...props }) => (
  <WarnPunishedDelegate
    daysLeft={daysLeft}
    punishmentStartDate={punishmentStartDate}
    {...props}
  />
);

export const EditVoteWarning = ({ daysLeft, ...props }) => (
  <VoteWarning {...props} daysLeft={daysLeft} />
);

const apis = {
  block: {
    apiUtil: (network, params) => getBlock({ network, params }),
    getApiParams: (_, ownProps) => ({
      height: ownProps.pomHeight.start,
    }),
    transformResponse: response => (response.data && response.data[0]),
    autoLoad: false,
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Warning);
