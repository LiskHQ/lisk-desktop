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
  month: i18n.t('MMM DD YYYY'),
  quarter: i18n.t('MMM YYYY'),
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
  borderColor: {
    LSK: '#4070f4',
    BTC: '#f7931a',
  },
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
        parser: (value) => {
          moment.locale(locale);
          return moment(value);
        },
        round: true,
      },
      gridLines: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 5,
      },
    }],
    yAxes: [{
      position: 'left',
      type: 'linear',
      ticks: {
        display: !isDiscreetMode,
        maxTicksLimit: 5,
        min: 0,
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
      hoverRadius: 3,
      hitRadius: 3,
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
        return moment(tooltipItem[0].xLabel).format(i18n.t('MMM DD YYYY'));
      },
      label(tooltipItem) {
        return `${i18n.t('Account Balance')}:          ${tooltipItem.yLabel} ${token}`;
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
 * Returns balance data grouped by an specific amount
 *
 * Value of each data is calculated as the balance of the day before
 * minus wheat ever spent or received today,
 * meaning if balance today is 100 and you spent 10 LSK yesterday (-10)
 * then your balance before that withdrawal was 110.
 * yesterdayBalance = todayBalance - yesterdayWithdrawal
 *
 * balance     79   75    70     70
 * txAmount    N    -4    -5      -
 * Date       8.2   9.2   10.2   Now
 *
 * @param {Object} param Object containing {
 *  @param {String} format,
 *  @param {Object[]} transactions,
 *  @param {Number} balance,
 *  @param {String} address,
 * }
 * @param {Node} canvas Canvas element to be used
 */
export const getBalanceData = ({
  transactions, balance, address, token,
}) => {
  const data = transactions
    .sort((a, b) => (b.timestamp - a.timestamp))
    .reduce((acc, item, index) => {
      const date = moment(getNormalizedTimestamp(item)).format('YYYY-MM-DD');
      const tx = transactions[index - 1];
      const txValue = tx ? parseFloat(fromRawLsk(getTxValue(tx, address))) : 0;
      // fix for the first item in list
      const lastBalance = acc[acc.length - 1]
        ? acc[acc.length - 1].y
        : parseFloat(fromRawLsk(balance));
      if (acc[acc.length - 1] && date === acc[acc.length - 1].x) {
        acc[acc.length - 1].y = acc[acc.length - 1].y - txValue;
      } else {
        acc.push({
          x: moment(getNormalizedTimestamp(item)).format('YYYY-MM-DD'),
          y: lastBalance - txValue,
        });
      }
      return acc;
    }, []).reverse();
  return {
    datasets: [{
      data,
      borderColor: styles.borderColor[token],
      pointBorderColor: styles.borderColor[token],
    }],
  };
};

export default {
  graphOptions,
};
