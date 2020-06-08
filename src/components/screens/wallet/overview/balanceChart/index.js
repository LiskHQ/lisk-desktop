import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import BoxEmptyState from '../../../../toolbox/box/emptyState';
import * as ChartUtils from '../../../../../utils/balanceChart';
import { tokenMap } from '../../../../../constants/tokens';
import i18n from '../../../../../i18n';
import { LineChart } from '../../../../toolbox/charts';
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
    if (!data && transactions.length && balance !== undefined) {
      const format = ChartUtils.getChartDateFormat(transactions);
      setOptions(ChartUtils.graphOptions({
        format,
        token,
        isDiscreetMode,
        locale: i18n.language,
      }));

      setData(ChartUtils.getBalanceData({
        transactions,
        balance,
        address,
        format,
      }));
    }
  }, [transactions]);

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('{{token}} balance', { token: tokenMap[token].label })}</h2>
        { data
          ? (
            <LineChart
              data={data}
              options={options}
            />
          )
          : (
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
