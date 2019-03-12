import moment from 'moment';
import { fromRawLsk } from './lsk';
import { getUnixTimestampFromFirstBlock } from './datetime';

export const graphOptions = format => ({
  maintainAspectRatio: false,
  gridLines: {
    display: true,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      display: true,
      type: 'time',
      time: {
        minUnit: 'day',
      },
      distribution: 'series',
      ticks: {
        fontColor: '#7383a7',
        fontSize: 12,
        fontFamily: '\'gilroy\', sans-serif',
      },
      gridLines: {
        display: false,
      },
    }],
    yAxes: [{
      position: 'right',
      type: 'linear',
      ticks: {
        maxTicksLimit: 5,
        fontColor: '#7383a7',
        fontSize: 12,
        fontFamily: '\'gilroy\', sans-serif',
      },
    }],
  },
  layout: {
    padding: {
      left: 0,
      right: 8,
      top: 20,
      bottom: 15,
    },
  },
  elements: {
    point: {
      backgroundColor: '#C80039',
      radius: 1,
      hoverRadius: 8,
      hitRadius: 20,
    },
    line: {
      tension: 0,
    },
  },
  tooltips: {
    callbacks: {
      title(tooltipItem) {
        return moment(tooltipItem[0].xLabel, 'MMMM DD YYYY h:mm:ss A')
          .format(format);
      },
      label(tooltipItem) {
        return `Account Balance:          ${tooltipItem.yLabel} LSK`;
      },
    },
    mode: 'index',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    bodyFontColor: '#2e2c3b',
    bodyFontFamily: 'gilroy',
    bodyFontSize: 12,
    bodyFontStyle: 'bold',
    titleFontColor: '#868ba1',
    titleFontFamily: 'gilroy',
    titleFontSize: 12,
    displayColors: false,
    xPadding: 16,
    yPadding: 18,
    titleSpacing: 12,
    titleMarginBottom: 12,
    cornerRadius: 0,
    caretSize: 15,
  },
});

/**
 * Returns value in interger format of the amount that was added or subtracted from the balance
 * @param {Object} tx Transaction Object
 * @param {String} address Account address
 */
const getTxValue = (tx, address) => {
  const txValue = tx.senderId && tx.senderId !== address
    ? parseInt(tx.amount, 10) || 0
    : parseInt(tx.amount, 10) + parseInt(tx.fee, 10);
  return tx.recipientId !== address ? txValue : -txValue;
};

/**
 * Returns a gradient to be used on the graph
 * @param {Object} ctx Context2D of a canvas element
 */
const getGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(0, 100, 0, 250);
  gradient.addColorStop(0, '#e9f3ff');
  gradient.addColorStop(1, 'white');
  return gradient;
};

/**
 * Returs balance data grouped by an specific amount
 * @param {Object} param Object containing {
 *  @param {Object[]} transactions,
 *  @param {String} data,
 *  @param {Number} balance,
 *  @param {String} address,
 * }
 * @param {Node} canvas Canvas element to be used
 */
export const getBalanceData = ({
  format, transactions, balance, address,
}, canvas) => {
  const ctx = canvas.getContext('2d');
  const gradient = getGradient(ctx);

  const data = transactions.reduce((balances, tx) => {
    const txValue = getTxValue(tx, address);
    const txDate = new Date(getUnixTimestampFromFirstBlock(tx.timestamp));
    const lastBalance = balances.slice(-1)[0];
    const tmpBalances = moment(lastBalance.x).format(format) === moment(txDate).format(format)
      ? balances.slice(0, -1) : balances;
    return [
      ...tmpBalances,
      { x: txDate, y: (parseInt(lastBalance.y, 10) + txValue) },
    ];
  }, [{ x: new Date(), y: +balance }]).reverse().map(d => ({ ...d, y: +fromRawLsk(d.y) }));

  return {
    datasets: [{
      data,
      backgroundColor: gradient,
      borderColor: '#7ab7ff',
      borderWidth: 2,
    }],
  };
};

export default {
  graphOptions,
};
