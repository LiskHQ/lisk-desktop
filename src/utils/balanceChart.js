import moment from 'moment';
import { fromRawLsk } from './lsk';
import { getUnixTimestampFromValue } from './datetime';
import { getTokenFromAddress } from './api/transactions';
import i18n from '../i18n';
import { tokenMap } from '../constants/tokens';

const formats = {
  second: i18n.t('MMM DD YYYY hh:mm:ss'),
  minute: i18n.t('MMM DD YYYY hh:mm'),
  hour: i18n.t('MMM DD YYYY hh[h]'),
  day: i18n.t('MMM DD YYYY'),
  month: i18n.t('MMM YYYY'),
  year: i18n.t('YYYY'),
};

const getUnitFromFormat = format =>
  Object.keys(formats).find(key => formats[key] === format);

const getNormalizedTimestamp = (tx) => {
  const token = getTokenFromAddress(tx.senderId) || tokenMap.BTC.key;
  return ({
    BTC: t => t,
    LSK: getUnixTimestampFromValue,
  }[token](tx.timestamp));
};

const styles = {
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  whiteSmoke: '#f5f7fa80',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  transparent: 'rgba(0, 0, 0, 0)',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

export const graphOptions = ({
  format,
  token,
  locale,
  isDiscreetMode = false,
}) => ({
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      display: true,
      type: 'time',
      time: {
        unit: getUnitFromFormat(format),
        displayFormats: formats,
        parser: (value) => {
          moment.locale(locale);
          return moment(value);
        },
        round: true,
      },
      gridLines: {
        display: false,
      },
      distribution: 'linear',
      ticks: {
        callback: (value) => {
          moment.locale(locale);
          return moment(value, format).format('MMM YY');
        },
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
        maxRotation: 0,
      },
    }],
    yAxes: [{
      position: 'left',
      type: 'linear',
      ticks: {
        display: !isDiscreetMode,
        maxTicksLimit: 5,
        fontColor: styles.slateGray,
        fontSize: styles.fontSize,
        fontFamily: styles.contentFontFamily,
      },
    }],
  },
  layout: {
    padding: {
      left: 10,
      right: 20,
      top: 20,
    },
  },
  elements: {
    point: {
      radius: 2,
      hoverRadius: 2,
      hitRadius: 1,
    },
    line: {
      tension: 0,
    },
  },
  tooltips: {
    enabled: !isDiscreetMode,
    callbacks: {
      title(tooltipItem) {
        moment.locale(locale);
        return moment(tooltipItem[0].xLabel, 'MMMM DD YYYY h:mm:ss A')
          .format(format);
      },
      label(tooltipItem) {
        return i18n.t('Account Balance:          {{balance}} {{token}}', { balance: tooltipItem.yLabel, token });
      },
    },
    mode: 'index',
  },
});

export const getChartDateFormat = (transactions) => {
  const last = moment();
  const first = transactions.length
    && moment(getNormalizedTimestamp(transactions.slice(-1)[0]));

  if (!first || !last) return '';
  if (last.diff(first, 'years') <= 1) return formats.month;
  if (last.diff(first, 'months') <= 1) return formats.day;
  if (last.diff(first, 'days') <= 3) return formats.hour;
  if (last.diff(first, 'hours') <= 12) return formats.minute;
  if (last.diff(first, 'minutes') <= 5) return formats.second;
  return formats.year;
};


const isIncomming = (tx, address) => tx.recipientId === address;
const isOutgoing = (tx, address) => tx.senderId === address;

/**
 * Returns value in interger format of the amount that was added or subtracted from the balance
 * @param {Object} tx Transaction Object
 * @param {String} address Account address
 */
const getTxValue = (tx, address) => (
  (isIncomming(tx, address) ? parseInt(tx.amount, 10) : 0)
    - (isOutgoing(tx, address) ? parseInt(tx.amount, 10) : 0)
    - (isOutgoing(tx, address) ? parseInt(tx.fee, 10) : 0)
);

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
  const unit = getUnitFromFormat(format);
  const data = transactions.reduce((balances, tx) => {
    const txValue = getTxValue(tx, address);
    const txDate = tx.timestamp ? moment(getNormalizedTimestamp(tx)) : moment();
    const lastBalance = balances.slice(-1)[0];
    const tmpBalances = balances.length > 1 && moment(lastBalance.x).isSame(txDate, unit)
      ? balances.slice(0, -1)
      : balances;
    return [
      ...tmpBalances,
      { x: txDate, y: (parseInt(lastBalance.y, 10) - txValue) },
    ];
  }, [{ x: moment(), y: +balance }])
    .reverse().map(d => ({
      x: d.x,
      y: fromRawLsk(d.y),
    }));

  return {
    datasets: [{
      data,
      backgroundColor: styles.transparent,
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
