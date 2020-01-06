import React from 'react';
import { withTranslation } from 'react-i18next';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxEmptyState from '../../toolbox/box/emptyState';
import * as ChartUtils from '../../../utils/balanceChart';
import { tokenMap } from '../../../constants/tokens';
import i18n from '../../../i18n';
import Chart from '../../toolbox/charts';
import styles from './balanceChart.css';

const BalanceGraph = ({
  t, transactions, token, balance, address, isDiscreetMode,
}) => {
  const format = ChartUtils.getChartDateFormat(transactions);

  const data = ChartUtils.getBalanceData({
    transactions,
    balance,
    address,
    format,
  });

  const options = ChartUtils.graphOptions({
    format,
    token,
    isDiscreetMode,
    locale: i18n.language,
  });

  return (
    <Box className={`${styles.wrapper}`}>
      <BoxHeader>
        <h1>{t('{{token}} balance', { token: tokenMap[token].label })}</h1>
      </BoxHeader>
      <div className={styles.content}>
        { transactions.length
          ? (
            <Chart
              data={data}
              options={options}
              type="line"
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
      </div>
    </Box>
  );
};

export default withTranslation()(BalanceGraph);
