import React from 'react';
import { withTranslation } from 'react-i18next';
import { Line as LineChart } from 'react-chartjs-2';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxEmptyState from '../../toolbox/box/emptyState';
import styles from './balanceChart.css';
import * as ChartUtils from '../../../utils/balanceChart';
import { tokenMap } from '../../../constants/tokens';
import i18n from '../../../i18n';

class BalanceGraph extends React.PureComponent {
  render() {
    const {
      t, transactions, balance, address, token, isDiscreetMode,
    } = this.props;

    const format = ChartUtils.getChartDateFormat(transactions);

    const data = ChartUtils.getBalanceData.bind(null, {
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
          <div className={`${styles.graphHolder}`}>
            { transactions.length
              ? (
                <LineChart
                  options={options}
                  data={data}
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
        </div>
      </Box>
    );
  }
}

export default withTranslation()(BalanceGraph);
