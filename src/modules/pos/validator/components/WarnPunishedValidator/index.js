import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { NUMBER_OF_BLOCKS_PER_DAY } from '@pos/validator/consts/validators';
import { useBlocks } from '@block/hooks/queries/useBlocks';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import { useTranslation } from 'react-i18next';
import VoteWarning from './VoteWarning';
import WarnPunishedValidator from './WarnPunishedValidator';

const getPunishmentDetails = (punishedTimestamp, pomHeight, currentHeight) => {
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  const daysLeft = Math.ceil((pomHeight.end - currentHeight) / NUMBER_OF_BLOCKS_PER_DAY);

  return { daysLeft, punishmentStartDate };
};

const Warning = ({ vote, ...props }) => {
  const { pomHeight } = props;
  const { t } = useTranslation();

  const {
    data: { height: currentHeight },
  } = useLatestBlock();
  const { data: blocksAtHeight } = useBlocks({ config: { params: { height: pomHeight.start } } });

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    blocksAtHeight.timestamp,
    props.pomHeight,
    currentHeight
  );

  if (vote) return <EditVoteWarning daysLeft={daysLeft} t={t} {...props} />;

  return (
    <ValidatorProfileWarning
      daysLeft={daysLeft}
      t={t}
      punishmentStartDate={punishmentStartDate}
      {...props}
    />
  );
};

export const ValidatorProfileWarning = ({ daysLeft, punishmentStartDate, ...props }) => (
  <WarnPunishedValidator daysLeft={daysLeft} punishmentStartDate={punishmentStartDate} {...props} />
);

export const EditVoteWarning = ({ daysLeft, ...props }) => (
  <VoteWarning {...props} daysLeft={daysLeft} />
);

export default withRouter(Warning);
