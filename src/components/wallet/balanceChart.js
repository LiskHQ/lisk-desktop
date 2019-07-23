import React from 'react';
import { translate } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import Box from '../box';
import styles from './balanceChart.css';
import * as ChartUtils from '../../utils/balanceChart';
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
        <header>
          <h1>{t('{{token}} Balance', { token: tokenMap[token].label })}</h1>
        </header>
        <main className={`${styles.content}`}>
          <div className={`${styles.graphHolder}`}>
            <LineChart
              options={ChartUtils.graphOptions(format)}
              data={data}
            />
          </div>
        </main>
      </Box>
    );
  }
}

export default translate()(BalanceGraph);
