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
import { useBlocks } from '@block/hooks/queries/useBlocks';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Tooltip from '@theme/Tooltip';
import { useTransactionsFromPool } from '@transaction/hooks/queries';
import styles from './ValidatorProfile.css';
import { convertCommissionToPercentage } from '../../utils';
import usePosToken from '../../hooks/usePosToken';
import { MAX_VALIDATOR_COMMISSION } from '../../consts';

const DetailsView = ({ data, isMyProfile, address }) => {
  const { name, rank, validatorWeight, commission, lastGeneratedHeight } = data;
  const { data: pooledTransactionsData } = useTransactionsFromPool({
    customConfig: { params: { address }, commission },
  });
  const hasChangeCommission = pooledTransactionsData?.data?.some(
    (pooledTransaction) => pooledTransaction.command === 'changeCommission'
  );

  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: generatedBlock } = useBlocks({
    config: { params: { height: lastGeneratedHeight } },
    options: { enabled: !!lastGeneratedHeight },
  });
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
      onView:
        commission < MAX_VALIDATOR_COMMISSION
          ? () => addSearchParamsToUrl(history, { modal: 'commissionHistory' })
          : undefined,
    },
    {
      icon: 'calendar',
      label: t('Last generated at'),
      value: generatedBlock?.data?.[0] ? (
        <DateTimeFromTimestamp
          fulltime
          className="date"
          time={generatedBlock?.data?.[0].timestamp}
        />
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
        {displayList.map(({ icon, label, value, onView, onEdit }) => (
          <div key={label} className={`${grid.row} ${styles.itemContainer}`}>
            <Icon name={icon} className={styles.icon} />
            <div className={`${grid.col} ${styles.item}`}>
              <div className={`${styles.title} ${theme}`}>
                <span>{label} </span>
                <span>
                  {onView && typeof onView === 'function' && (
                    <button onClick={onView} className={styles.editBtn}>
                      <Icon name="history" />
                    </button>
                  )}
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
                </span>
              </div>
              <div
                className={classNames({
                  [styles.value]: true,
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
