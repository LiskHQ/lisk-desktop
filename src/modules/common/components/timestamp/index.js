import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import i18n from 'src/utils/i18n/i18n';

const DateTimeFromTimestamp = withTranslation()((props) => {
  moment.locale(i18n.language);
  const dateTime = moment(props.time * 1000);
  return (
    <span className={`${props.className || ''}`}>
      {props.fulltime
        ? /* istanbul ignore next */
          dateTime.format('DD MMM YYYY, hh:mm:ss A')
        : dateTime.calendar(null, {
            lastDay: props.t('DD MMM YYYY'),
            sameDay: props.t('hh:mm A'),
            nextDay: props.t('[Tomorrow], hh:mm A'),
            lastWeek: props.t('DD MMM YYYY'),
            nextWeek: props.t('DD MMM YYYY'),
            sameElse: props.t('DD MMM YYYY'),
          })}
    </span>
  );
});

export default DateTimeFromTimestamp;
