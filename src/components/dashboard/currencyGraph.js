import { connect } from 'react-redux';
import { Line as LineChart, Chart } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import moment from 'moment';
import React from 'react';

import { getCurrencyGraphData } from '../../actions/liskService';

import EmptyState from '../emptyState';
import styles from './currencyGraph.css';

const bottomPadding = 15;

const chartOptions = step => ({
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
      time: step.timeFormat,
      distribution: 'linear',
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
      top: 0,
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

const getGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 0, 800, 0);
  gradient.addColorStop(0, '#004AFF');
  gradient.addColorStop(0.5, '#57AFFF');
  gradient.addColorStop(1, '#93F4FE');
  return gradient;
};

const chartData = (data, canvas) => {
  const ctx = canvas.getContext('2d');
  const gradient = getGradient(ctx);

  return {
    datasets: [{
      data,
      backgroundColor: gradient,
      borderColor: gradient,
      borderWidth: 0,
    }],
  };
};

const drawGradientRectangle = (chartInstance, { bottomPosition, height }) => {
  const { ctx } = chartInstance.chart;
  const gradient = getGradient(ctx);

  ctx.fillStyle = gradient;
  ctx.fillRect(
    0, chartInstance.chart.height - bottomPosition,
    chartInstance.chart.width, height,
  );
};

const steps = [
  {
    title: '24h',
    span: 'hour',
    length: 24,
    timeFormat: {
      displayFormats: {
        hour: 'H:mm',
      },
      minUnit: 'hour',
    },
  },
  {
    title: '7d',
    span: 'day',
    length: 7,
    timeFormat: {
      minUnit: 'day',
    },
  },
  {
    title: '1m',
    span: 'day',
    length: 30,
    timeFormat: {
      minUnit: 'day',
    },
  },
];

class CurrencyGraph extends React.Component {
  constructor() {
    super();
    this.state = {
      step: steps[0],
    };
  }

  componentWillMount() {
    this.props.getCurrencyGraphData(this.state.step);
  }

  setStep(step) {
    this.setState({ step, data: undefined });
    this.props.getCurrencyGraphData(step);
  }

  render() {
    Chart.pluginService.register({
      beforeDraw(chartInstance) {
        drawGradientRectangle(chartInstance, {
          bottomPosition: bottomPadding + 35,
          height: 50,
        });
      },
      afterDraw(chartInstance) {
        drawGradientRectangle(chartInstance, {
          bottomPosition: bottomPadding + 32,
          height: 5,
        });
      },
    });

    return (
      <div className={`${styles.wrapper}`} >
        <div className={styles.stepSwitchWrapper}>
          {steps.map(step => (
            <span key={step.title}
              className={`${styles.stepSwitch} ${this.state.step === step ? styles.active : null} step`}
              onClick={this.setStep.bind(this, step)}>
              {step.title}
            </span>
          ))}
        </div>
        <header><h2>{this.props.t('LSK/BTC')}</h2></header>
        <div className={`${styles.chartWrapper} chart-wrapper`} >
          {this.props.liskService.prices ?
            <LineChart
              data={chartData.bind(null, this.props.liskService.prices.data)}
              options={chartOptions(this.props.liskService.step)}/> :
            null}
          {this.props.liskService.graphError ?
            <EmptyState className={styles.errorMessage}
              message={this.props.t('Price data currently not available')} /> :
            null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  liskService: state.liskService,
});

const mapDispatchToProps = dispatch => ({
  getCurrencyGraphData: data => dispatch(getCurrencyGraphData(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(CurrencyGraph));
