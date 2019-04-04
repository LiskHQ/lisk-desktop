import moment from 'moment';
import { fromRawLsk } from './lsk';
import { getUnixTimestampFromValue } from './datetime';

const formats = {
  second: 'MMM DD YYYY hh:mm:ss',
  minute: 'MMM DD YYYY hh:mm',
  hour: 'MMM DD YYYY hh[h]',
  day: 'MMM DD YYYY',
  month: 'MMM YYYY',
};

const getUnitFromFormat = format =>
  Object.keys(formats).find(key => formats[key] === format);

const styles = {
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  whiteSmoke: '#f5f7fa80',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 12,
};

export const graphOptions = format => ({
  plugins: {
    hideAxisX: false,
  },
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
        unit: getUnitFromFormat(format),
      },
      distribution: 'linear',
      ticks: {
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
        maxRotation: 0,
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
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
      },
    }],
  },
  layout: {
    padding: {
      left: 20,
      right: 8,
      top: 20,
    },
  },
  elements: {
    point: {
      radius: 1,
      hoverRadius: 6,
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
    backgroundColor: styles.whiteColor,
    bodyFontColor: styles.maastrichtBlue,
    bodyFontFamily: styles.contentFontFamily,
    bodyFontSize: 13,
    bodyFontStyle: 'bold',
    borderColor: styles.platinumColor,
    borderWidth: 1,
    titleFontColor: styles.slateGray,
    titleFontFamily: styles.contentFontFamily,
    titleFontSize: 11,
    titleFontStyle: 'semi-bold',
    displayColors: false,
    xPadding: 20,
    yPadding: 20,
    titleMarginBottom: 12,
    cornerRadius: 0,
    caretSize: 15,
  },
});

export const getChartDateFormat = (transactions) => {
  const last = moment();
  const first = transactions.length
    && moment(getUnixTimestampFromValue(transactions.slice(-1)[0].timestamp));

  if (!first || !last) return '';
  let format = formats.month;
  if (last.diff(first, 'days') <= 30) format = formats.day;
  if (last.isSame(first, 'day')) format = formats.hour;
  if (last.isSame(first, 'hour')) format = formats.minute;
  if (last.isSame(first, 'minute')) format = formats.second;
  return format;
};

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
 * Returs balance data grouped by an specific amount
 * @param {Object} param Object containing {
 *  @param {String} format,
 *  @param {Object[]} transactions,
 *  @param {Number} balance,
 *  @param {String} address,
 * }
 * @param {Node} canvas Canvas element to be used
 */
export const getBalanceData = ({
  format, transactions, balance, address,
}) => {
  const data = transactions.reduce((balances, tx) => {
    const txValue = getTxValue(tx, address);
    const txDate = tx.timestamp ? new Date(getUnixTimestampFromValue(tx.timestamp)) : new Date();
    const lastBalance = balances.slice(-1)[0];
    const tmpBalances = balances.length > 1 && moment(lastBalance.x).isSame(txDate, unit)
      ? balances.slice(0, -1)
      : balances;
    return [
      ...tmpBalances,
      { x: txDate, y: (parseInt(lastBalance.y, 10) + txValue) },
    ];
  }, [{ x: moment(), y: +balance }]).reverse().map(d => ({ ...d, y: +fromRawLsk(d.y) }));

  return {
    datasets: [{
      data,
      backgroundColor: styles.whiteSmoke,
      borderColor: styles.borderColor,
      pointBorderColor: styles.borderColor,
      pointBackgroundColor: styles.whiteColor,
      pointHoverBackgroundColor: styles.whiteColor,
      pointHoverBorderColor: styles.ultramarineBlue,
      pointHoverBorderWidth: 4,
      borderWidth: 2,
    }],
  };
};

export default {
  graphOptions,
};
