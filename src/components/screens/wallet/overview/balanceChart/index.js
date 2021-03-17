import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '@constants';
import * as Chartutils from '@utils/balanceChart';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import BoxEmptyState from '../../../../toolbox/box/emptyState';
import i18n from '../../../../../i18n';
import { LineChart } from '../../../../toolbox/charts';
import Icon from '../../../../toolbox/icon';
import styles from './balanceChart.css';

const BalanceGraph = ({
  t, transactions, token, isDiscreetMode, balance, address,
}) => {
  const [data, setData] = useState(null);
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (data) {
      setData(null);
    }
  }, [token]);

  useEffect(() => {
    if (transactions.length && balance !== undefined) {
      const format = Chartutils.getChartDateFormat(transactions);
      setOptions(Chartutils.graphOptions({
        format,
        token,
        locale: i18n.language,
      }));

      setData(Chartutils.getBalanceData({
        transactions,
        balance,
        address,
        format,
        token,
      }));
    }
  }, [transactions]);

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('{{token}} balance', { token: tokenMap[token].label })}</h2>
        {
          data && !isDiscreetMode && (
            <LineChart
              data={data}
              options={options}
            />
          )
        }
        {
          isDiscreetMode && (
            <div className={styles.discreetMode}>
              <Icon name="discreetMode" className={styles.icon} />
              <p>The balance chart is not visible in discreet mode.</p>
            </div>
          )
        }
        {
          !data && !isDiscreetMode && (
            <BoxEmptyState>
              <p>
                {t('There are no transactions.')}
              </p>
            </BoxEmptyState>
          )
        }
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceGraph);
