import { Line as LineChart, Chart } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import moment from 'moment';
import React from 'react';
import explorerApi from '../../utils/api/explorer';

import styles from './currencyGraph.css';

const bottomPadding = 15;

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
      time: {
        displayFormats: {
          minute: 'H:mm',
        },
      },
      distribution: 'series',
      ticks: {
        fontColor: '#204F9F',
        fontSize: 14,
        fontFamily: '\'Open Sans\', sans-serif',
      },
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
      bottom: bottomPadding,
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
        return moment(tooltipItem.xLabel).format('DD MMM             HH:mm:ss').replace(' 0', '  ');
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

const getGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, '#004AFF');
  gradient.addColorStop(0.5, '#57AFFF');
  gradient.addColorStop(1, '#93F4FE');
  return gradient;
};

const chartData = (canvas) => {
  const ctx = canvas.getContext('2d');
  const gradient = getGradient(ctx);

  return {
    datasets: [{
      data: explorerApi.getCurrencyGrapData(),
      backgroundColor: gradient,
      borderColor: gradient,
      borderWidth: 0,
    }],
  };
};

const CurrencyGraph = ({ t }) => {
  Chart.pluginService.register({
    beforeDraw(chartInstance) {
      const { ctx } = chartInstance.chart;
      const gradient = getGradient(ctx);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        0, chartInstance.chart.height - bottomPadding - 35,
        chartInstance.chart.width, 50,
      );
    },
    afterDraw(chartInstance) {
      const { ctx } = chartInstance.chart;
      const gradient = getGradient(ctx);

      ctx.fillStyle = gradient;
      ctx.fillRect(
        0, chartInstance.chart.height - bottomPadding - 32,
        chartInstance.chart.width, 5,
      );
    },
  });

  return (
    <div className={`${styles.wrapper}`} >
      <h2>{t('LSK/BTC')}</h2>
      <div className={`${styles.chartWrapper}`} >
        <LineChart data={chartData} options={chartOptions}/>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  transactions: [...state.transactions.pending, ...state.transactions.confirmed].slice(0, 3),
});

export default connect(mapStateToProps)(translate()(CurrencyGraph));
