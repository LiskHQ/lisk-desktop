import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import classNames from 'classnames';
import { useTheme } from '@theme/Theme';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import Icon from '@theme/Icon';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Tooltip from '@theme/Tooltip';
import { useTransactionsFromPool } from '@transaction/hooks/queries';
import styles from './ValidatorProfile.css';
import { convertCommissionToPercentage } from '../../utils';
import usePosToken from '../../hooks/usePosToken';

// eslint-disable-next-line max-statements
const DetailsView = ({ data, isMyProfile, address }) => {
  const { name, rank, validatorWeight, commission } = data;
  const { data: pooledTransactionsData } = useTransactionsFromPool({
    address,
    customConfig: { commission },
  });
  const hasChangeCommission = pooledTransactionsData?.data?.some(
    (pooledTransaction) => pooledTransaction.command === 'changeCommission'
  );

  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();
  // @TODO: this is wrong we need to get this value from the validator's endpoint.
  const {
    data: { timestamp: latestBlockTimestamp },
  } = useLatestBlock();
  const { token } = usePosToken();

  const displayList = [
    {
      icon: 'validatorName',
      label: t('Validator name'),
      value: name ?? '-',
    },
    {
      icon: 'star',
      label: t('Rank'),
      value: rank ?? '-',
    },
    {
      icon: 'weight',
      label: t('Validator weight'),
      value: <TokenAmount val={validatorWeight} token={token} />,
    },
    {
      icon: 'commissionIcon',
      label: t('Commission'),
      value: `${convertCommissionToPercentage(commission)}%`,
      onEdit: !isMyProfile
        ? undefined
        : () => addSearchParamsToUrl(history, { modal: 'changeCommission' }),
    },
    {
      icon: 'calendar',
      label: t('Last generated at'),
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
                {onEdit &&
                  typeof onEdit === 'function' &&
                  (hasChangeCommission ? (
                    <Tooltip
                      className={classNames(styles.editDisabledIcon, styles.editBtn)}
                      tooltipClassName={`${styles.tooltipClassNameProp}`}
                      size="maxContent"
                      position="bottom"
                      content={<Icon name="editDisabled" />}
                    >
                      <p>
                        {t(
                          'You have to wait for your current commission change to finalize before you can edit again.'
                        )}
                      </p>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={onEdit}
                      className={styles.editBtn}
                      disabled={hasChangeCommission}
                    >
                      <Icon name="editActiveIcon" />
                    </button>
                  ))}
              </div>
              <div
                className={classNames({
                  [styles.value]: true,
                  [styles.capitalized]: true,
                  [styles.textLineThrough]:
                    hasChangeCommission && onEdit && typeof onEdit === 'function',
                })}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </BoxContent>
    </Box>
  );
};

export default DetailsView;
