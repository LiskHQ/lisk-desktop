import React from 'react';
import { translate } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import BoxV2 from '../boxV2';
import styles from './balanceChart.css';
import * as ChartUtils from '../../utils/balanceChart';
import EmptyState from '../emptyStateV2';
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
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
          <h1>{t('{{token}} balance', { token: tokenMap[token].label })}</h1>
        </header>
        <main className={`${styles.content}`}>
          <div className={`${styles.graphHolder}`}>
            { transactions.length
              ? <LineChart
                   options={ChartUtils.graphOptions(format)}
                   data={data}
                 />
              : <EmptyState>
                  <p>
                    {t('There are no transactions.')}
                  </p>
                </EmptyState>
            }
          </div>
        </main>
      </BoxV2>
    );
  }
}

export default translate()(BalanceGraph);
