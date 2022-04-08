import moment from 'moment';
import { chartStyles } from '@common/configuration';
import { fromRawLsk } from '@token/utilities/lsk';
import i18n from '@setup/i18n/i18n';
import { getUnixTimestampFromValue } from '@views/configuration/datetime';

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

const getNormalizedTimestamp = (tx, token) => ({
  BTC: t => t,
  LSK: getUnixTimestampFromValue,
}[token](tx.timestamp));

const styles = {
  borderColor: {
    LSK: '#4070f4',
    BTC: '#f7931a',
  },
  pointBackgroundColor: chartStyles.pointBackgroundColor,
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
      radius: 5,
      hoverRadius: 5,
      hitRadius: 5,
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
        return `${i18n.t('Account balance')}:          ${tooltipItem.yLabel} ${token}`;
      },
    },
    mode: 'index',
  },
});

export const getChartDateFormat = (transactions, token) => {
  const last = moment();
  const first = transactions.length
    && moment(getNormalizedTimestamp(transactions.slice(-1)[0], token));

  if (!first || !last) return '';
  if (last.diff(first, 'years') <= 1) return formats.month;
  if (last.diff(first, 'months') <= 1) return formats.day;
  if (last.diff(first, 'days') <= 3) return formats.hour;
  if (last.diff(first, 'hours') <= 12) return formats.minute;
  if (last.diff(first, 'minutes') <= 5) return formats.second;
  return formats.year;
};

const isIncoming = (tx, address) => tx.asset.recipient?.address === address;
const isOutgoing = (tx, address) => tx.sender.address === address;

/**
 * Returns value in interger format of the amount that was added or subtracted from the balance
 * @param {Object} tx Transaction Object
 * @param {String} address Account address
 */
const getTxValue = (tx, address) => (
  (isIncoming(tx, address) ? parseInt(tx.asset.amount, 10) : 0)
    - (isOutgoing(tx, address) ? parseInt(tx.asset?.amount ?? 0, 10) : 0)
    - (tx.moduleAssetId === '5:1'
      ? tx.asset.votes.reduce((sum, vote) => { sum += parseInt(vote.amount, 10); return sum; }, 0)
      : 0)
    - parseInt(tx.fee, 10)
);

/**
 *  Converts the timestamp to YYYY-MM-DD format
 * @param {Number} timestamp - Tx timestamp received from the API
 * @param {String} token - Option of LSK and BTC
 * @returns {String} - Date in YYYY-MM-DD format
 */
const getDate = (timestamp, token) => {
  const multiplier = token === 'LSK' ? 1000 : 1;
  const date = new Date(timestamp * multiplier);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

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
  transactions, balance, address, token, theme = 'light',
}) => {
  const data = transactions
    .sort((a, b) => (b.block.timestamp - a.block.timestamp))
    .reduce(({ allTransactions, graphTransactions }, item, index) => {
      const date = getDate(item.block.timestamp, token);
      const tx = transactions[index - 1];
      const txValue = tx ? parseFloat(fromRawLsk(getTxValue(tx, address))) : 0;
      const lastBalance = allTransactions[allTransactions.length - 1]
        ? allTransactions[allTransactions.length - 1].y
        : parseFloat(fromRawLsk(balance));
      const transactionData = {
        x: getDate(item.block.timestamp, token),
        y: lastBalance - txValue,
      };

      allTransactions.push(transactionData);

      // Pick up latest transaction for the latest day
      if (Object.keys(graphTransactions).length === 0) {
        graphTransactions[date] = transactionData;
      // Pick up earliest transactions for the other days
      } else if (Object.keys(graphTransactions)[0] !== date) {
        graphTransactions[date] = transactionData;
      }

      return {
        allTransactions,
        graphTransactions,
      };
    }, { allTransactions: [], graphTransactions: {} });

  return {
    datasets: [{
      data: Object.values(data.graphTransactions).reverse(),
      borderColor: styles.borderColor[token],
      pointBorderColor: styles.borderColor[token],
      pointBorderWidth: 4.5,
      pointBackgroundColor: styles.pointBackgroundColor[theme],
    }],
  };
};
