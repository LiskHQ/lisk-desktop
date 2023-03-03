import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTheme } from '@theme/Theme';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import Icon from '@theme/Icon';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './ValidatorProfile.css';
import { convertCommissionToPercentage } from '../../utils';
import usePosToken from '../../hooks/usePosToken';

const DetailsView = ({ data, history, isMyProfile }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { rank } = data;
  const status = data.status || '';
  // @TODO: this is wrong we need to get this value from the validator's endpoint.
  const {
    data: { timestamp: latestBlockTimestamp },
  } = useLatestBlock();
  const { token } = usePosToken()

  const displayList = [
    {
      icon: 'star',
      label: t('Rank'),
      value: rank ?? '-',
    },
    {
      icon: 'clockActive',
      label: t('Round state'),
      value: status.toLowerCase(),
    },
    {
      icon: 'weight',
      label: t('Validator weight'),
      value: <TokenAmount val={data.validatorWeight} token={token} />,
    },
    {
      icon: 'commissionsIcon',
      label: t('Commission'),
      value: `${convertCommissionToPercentage(data.commission)}%`,
      onEdit: !isMyProfile ? undefined : () => addSearchParamsToUrl(history, { modal: 'changeCommission' }),
    },
    {
      icon: 'calendar',
      label: t('Last generated block'),
      value: latestBlockTimestamp ? (
        <DateTimeFromTimestamp fulltime className="date" time={latestBlockTimestamp} />
      ) : (
        '-'
      ),
    },
  ];

  return (
    <Box
      className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']} ${styles.detailsContainer} details-container`}
    >
      <BoxHeader>
        <h1 className={styles.heading}>{t('Details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.details} details`}>
        {displayList.map(({ icon, label, value, onEdit }) => (
          <div key={label} className={`${grid.row} ${styles.itemContainer}`}>
            <Icon name={icon} className={styles.icon} />
            <div className={`${grid.col} ${styles.item}`}>
              <div className={`${styles.title} ${theme}`}>
                <span>{label} </span>
                {onEdit && typeof onEdit === 'function' && (
                  <button onClick={onEdit} className={styles.editBtn}>
                    <Icon name="editActiveIcon" />
                  </button>
                )}
              </div>
              <div className={styles.value}>{value}</div>
            </div>
          </div>
        ))}
      </BoxContent>
    </Box>
  );
};

export default withRouter(DetailsView);
