import React from 'react';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Line as LineChart } from 'react-chartjs-2';
import { fromRawLsk } from '../../utils/lsk';
import { getUnixTimestampFromFirstBlock } from '../../utils/datetime';
import BoxV2 from '../boxV2';
import transactionTypes from '../../constants/transactionTypes';
import styles from './balanceChart.css';

const chartOptions = options => ({
  maintainAspectRatio: false,
  gridLines: {
    display: true,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      type: 'time',
      time: {
        minUnit: 'day',
      },
      distribution: 'linear',
      ticks: {
        fontColor: '#7383a7',
        fontSize: 12,
        fontFamily: 'gilroy',
      },
      gridLines: {
        display: false,
      },
    }],
    yAxes: [{
      position: 'right',
      ticks: {
        ...options,
        fontColor: '#7383a7',
        fontSize: 12,
        fontFamily: 'gilroy',
      },
    }],
  },
  layout: {
    padding: {
      left: 8,
      right: 8,
      top: 16,
    },
  },
  elements: {
    point: {
      backgroundColor: '#C80039',
      radius: 0,
      hoverRadius: 8,
      hitRadius: 40,
    },
    line: {
      tension: 0,
    },
  },
  tooltips: {
    callbacks: {
      title(tooltipItem) {
        return `${tooltipItem[0].yLabel} LSK`;
      },
      label(tooltipItem) {
        return moment(tooltipItem.xLabel, 'MMMM DD YYYY h:mm:ss A')
          .format('DD MMM             HH:mm:ss').replace(' 0', '  ');
      },
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    titleFontSize: 18,
    titleFontColor: '#0000',
    bodyFontColor: '#74869B',
    bodyFontSize: 12,
    displayColors: false,
    xPadding: 16,
    yPadding: 18,
    titleFontFamily: 'gilroy',
    titleSpacing: 12,
    titleMarginBottom: 12,
    cornerRadius: 0,
    caretSize: 15,
  },
});

class BalanceGraph extends React.Component {
  constructor() {
    super();

    this.state = {
      data: [],
    };

    this.getBalanceData = this.getBalanceData.bind(this);
    this.getTxValue = this.getTxValue.bind(this);
  }

  getTxValue(tx) {
    const { address } = this.props;
    const txValue = tx.senderId && tx.senderId !== address
      ? tx.amount || 0
      : parseInt(tx.amount, 10) + parseInt(tx.fee, 10);
    return tx.type === transactionTypes.send && tx.recipientId !== address ? txValue : -txValue;
  }

  getBalanceData() {
    const { transactions, balance } = this.props;
    return transactions.reduce((balances, tx) => {
      const txValue = this.getTxValue(tx);
      const txDate = moment(getUnixTimestampFromFirstBlock(tx.timestamp)).toDate();
      const lastBalance = balances.slice(-1)[0];
      if (moment(lastBalance.x).format('DD.MM.YYYY') === moment(txDate).format('DD.MM.YYYY')) {
        return [
          ...balances.slice(0, -1),
          {
            x: lastBalance.x,
            y: (+lastBalance.y + +txValue),
          },
        ];
      }
      return [
        ...balances,
        {
          x: txDate,
          y: (+lastBalance.y + +txValue),
        },
      ];
    }, [{
      x: moment().toDate(),
      y: +balance,
    }]).map(b => ({
      ...b,
      y: +fromRawLsk(b.y),
    })).reverse();
  }

  render() {
    const { t } = this.props;
    const balances = this.getBalanceData();
    const options = {
      maxTicksLimit: 5,
    };

    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
          <h1>{t('Balance details')}</h1>
        </header>
        <main id={'balanceChart'} className={`${styles.content}`}>
          <LineChart
            options={chartOptions(options)}
            data={{
              datasets: [{
                label: 'balance',
                data: balances,
                borderColor: '#7ab7ff',
                borderWidth: 2,
              }],
            }} />
        </main>
      </BoxV2>
    );
  }
}

export default translate()(BalanceGraph);
