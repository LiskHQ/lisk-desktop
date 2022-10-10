import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { NUMBER_OF_BLOCKS_PER_DAY } from '@dpos/validator/consts/delegates';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import { useTranslation } from 'react-i18next';
import VoteWarning from './VoteWarning';
import WarnPunishedDelegate from './WarnPunishedDelegate';

const getPunishmentDetails = (punishedTimestamp, pomHeight, currentHeight) => {
  const startDate = new Date(punishedTimestamp * 1000);
  const punishmentStartDate = moment(startDate).format('MM.DD.YYYY');
  const daysLeft = Math.ceil((pomHeight.end - currentHeight) / NUMBER_OF_BLOCKS_PER_DAY);

  return { daysLeft, punishmentStartDate };
};

const Warning = ({ vote, ...props }) => {
  const { pomHeight } = props;
  const { t } = useTranslation();

const { data: blocks } = useBlocks();
  const { data: blocksAtHeight } = useBlocks({ config: { params: { height: pomHeight.start } } });

  const blockTimestamp = useMemo(() => blocks?.data?.[0]?.timestamp || null, [blocksAtHeight]);
  const currentHeight = useMemo(() => blocks?.data?.[0]?.height || null, [blocks]);

  const { daysLeft, punishmentStartDate } = getPunishmentDetails(
    blockTimestamp,
    props.pomHeight,
    currentHeight
  );

  if (vote) return <EditVoteWarning daysLeft={daysLeft} t={t} {...props} />;

  return (
    <DelegateProfileWarning
      daysLeft={daysLeft}
      t={t}
      punishmentStartDate={punishmentStartDate}
      {...props}
    />
  );
};

export const DelegateProfileWarning = ({ daysLeft, punishmentStartDate, ...props }) => (
  <WarnPunishedDelegate daysLeft={daysLeft} punishmentStartDate={punishmentStartDate} {...props} />
);

export const EditVoteWarning = ({ daysLeft, ...props }) => (
  <VoteWarning {...props} daysLeft={daysLeft} />
);

export default withRouter(Warning);
