import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import i18n from '@setup/i18n/i18n';

const timestampConverters = {
  LSK: timestamp => timestamp * 1000,
  BTC: timestamp => timestamp,
};

const DateTimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const datetime = moment(timestampConverters[props.token || 'LSK'](props.time));
  return (
    <span className={`${props.className || ''}`}>
      {
    props.fulltime ? (
      /* istanbul ignore next */
      datetime.format('DD MMM YYYY, hh:mm:ss A')
    )
      : datetime.calendar(null, {
        lastDay: props.t('DD MMM YYYY'),
        sameDay: props.t('hh:mm A'),
        nextDay: props.t('[Tomorrow], hh:mm A'),
        lastWeek: props.t('DD MMM YYYY'),
        nextWeek: props.t('DD MMM YYYY'),
        sameElse: props.t('DD MMM YYYY'),
      })
  }
    </span>
  );
});

export default DateTimeFromTimestamp;
