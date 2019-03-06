import React from 'react';
import { translate } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import BoxV2 from '../boxV2';
import styles from './balanceChart.css';
import * as ChartUtils from '../../utils/balanceChart';

class BalanceGraph extends React.Component {
  render() {
    const {
      t, transactions, balance, address,
    } = this.props;
    const chartData = ChartUtils
      .getBalanceDataByTx.bind(null, transactions.slice(0, 30), balance, address);

    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
          <h1>{t('Balance details')}</h1>
        </header>
        <main className={`${styles.content}`}>
          <div className={`${styles.graphHolder}`}>
            <LineChart
              options={ChartUtils.graphOptions}
              data={chartData} />
          </div>
        </main>
      </BoxV2>
    );
  }
}

export default translate()(BalanceGraph);
