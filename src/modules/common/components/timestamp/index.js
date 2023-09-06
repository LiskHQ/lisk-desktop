import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import i18n from 'src/utils/i18n/i18n';
import styles from './timestamp.css';

const DateTimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const dateTime = moment(props.time * 1000);
  const isToday = dateTime.isSame(moment(), 'day');

  function getDefaultDateFormatted() {
    return dateTime.calendar(null, {
      lastDay: props.t('DD MMM YYYY'),
      nextDay: props.t('[Tomorrow], hh:mm A'),
      lastWeek: props.t('DD MMM YYYY'),
      nextWeek: props.t('DD MMM YYYY'),
      sameElse: props.t('DD MMM YYYY'),
    });
  }

  if (props.onlyTime) {
    return <span className={`${props.className || ''}`}>{dateTime.format('hh:mm A')}</span>;
  }

  if (props.tableDateFormat) {
    return (
      <div className={classNames(styles.tableDateFormat, props.className)}>
        <span className={`${props.className || ''}`}>{getDefaultDateFormatted()}</span>
        {!isToday && (
          <span className={`${props.className || ''}`}>{dateTime.format('hh:mm A')}</span>
        )}
      </div>
    );
  }

  return (
    <span className={`${props.className || ''}`} data-testid="date-timestamp">
      {props.fulltime
        ? /* istanbul ignore next */
          dateTime.format('DD MMM YYYY, hh:mm:ss A')
        : getDefaultDateFormatted()}
    </span>
  );
});

export default DateTimeFromTimestamp;
