import { Line as LineChart } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import moment from 'moment';
import React from 'react';
import explorerApi from '../../utils/api/explorer';

import styles from './currencyGraph.css';

const chartOptions = {
  maintainAspectRatio: false,
  gridLines: {
    display: false,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      type: 'time',
      distribution: 'series',
      gridLines: {
        display: false,
      },
    }],
    yAxes: [{
      display: false,
      gridLines: {
        display: false,
      },
    }],
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 80,
      bottom: 0,
    },
  },
  elements: {
    point: {
      backgroundColor: '#C80039',
      radius: 0,
      hoverRadius: 8,
      hitRadius: 40,
    },
  },
  tooltips: {
    callbacks: {
      title(tooltipItem) {
        return `BTC ${tooltipItem[0].yLabel}`;
      },
      label(tooltipItem) {
        return moment(tooltipItem.xLabel).format('DD MMM           h:mm:ss');
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
};

const chartData = (canvas) => {
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, '#004AFF');
  gradient.addColorStop(0.5, '#57AFFF');
  gradient.addColorStop(1, '#93F4FE');
  return {
    datasets: [{
      data: explorerApi.getCurrencyGrapData(),
      backgroundColor: gradient,
      borderColor: gradient,
      borderWidth: 0,
    }],
  };
};

const CurrencyGraph = ({ t }) => (
  <div className={`${styles.wrapper}`} >
    <h2>{t('LSK/BTC')}</h2>
    <div className={`${styles.chartWrapper}`} >
      <LineChart data={chartData} options={chartOptions}/>
    </div>
  </div>
);

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 3),
});

export default connect(mapStateToProps)(translate()(CurrencyGraph));
