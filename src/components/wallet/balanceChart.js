import React from 'react';
import { translate } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import Box from '../toolbox/box';
import styles from './balanceChart.css';
import * as ChartUtils from '../../utils/balanceChart';
import EmptyState from '../emptyState';
import { tokenMap } from '../../constants/tokens';

class BalanceGraph extends React.Component {
  render() {
    const {
      t, transactions, balance, address, token,
    } = this.props;

    const format = ChartUtils.getChartDateFormat(transactions);

    const data = ChartUtils.getBalanceData.bind(null, {
      transactions,
      balance,
      address,
      format,
    });

    return (
      <Box className={`${styles.wrapper}`}>
        <Box.Header>
          <h1>{t('{{token}} balance', { token: tokenMap[token].label })}</h1>
        </Box.Header>
        <div className={styles.content}>
          <div className={`${styles.graphHolder}`}>
            { transactions.length
              ? (
                <LineChart
                  options={ChartUtils.graphOptions(format)}
                  data={data}
                />
              )
              : (
                <EmptyState>
                  <p>
                    {t('There are no transactions.')}
                  </p>
                </EmptyState>
              )
            }
          </div>
        </div>
      </Box>
    );
  }
}

export default translate()(BalanceGraph);
