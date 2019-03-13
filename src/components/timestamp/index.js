import React from 'react';
import moment from 'moment';
import Tooltip from 'react-toolbox/lib/tooltip';
import theme from 'react-toolbox/lib/tooltip/theme.css';
import { translate } from 'react-i18next';
import i18n from '../../i18n';

const _convertTimeFromFirstBlock = value =>
  new Date((((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + value) * 1000));
/**
 * Remove an array of keys from object
 * @param {object} obj - an object that we want to remove some properties from that
 * @param {array} arr - list of name of properties that we want to remove them
 * @return {object} list - an object that hasn't any of items in arr
 */
const _remove = (obj, arr) => {
  let list = []; // eslint-disable-line
  const temp = Object.keys(obj)
    .filter(key => !arr.includes(key));
  temp.forEach((item) => {
    list[item] = obj[item];
  });
  return list;
};

const Div = (props) => {
  const rest = _remove(props, ['theme', 'tooltip', 'tooltipDelay', 'tooltipHideOnClick']);
  return (<div {...rest} />);
};

/**
 * This wrapper add theme style and default delay, and disable tooltip when `tooltip` is empty.
 * @param props
 */
export const TooltipWrapper = (props) => {
  const Tip = Tooltip(Div); // eslint-disable-line
  if (props.tooltip) {
    return (<Tip
      tooltipPosition="top"
      tooltipDelay={350}
      {...props}
      theme={Object.assign({}, theme, props.theme || {})} />);
  }
  return <Div {...props} />;
};

export const Time = translate()((props) => {
  moment.locale(i18n.language);
  const time = moment(_convertTimeFromFirstBlock(props.label));
  return <span>{time.fromNow(true)}</span>;
});

export const DateFromTimestamp = translate()((props) => {
  moment.locale(i18n.language);
  const day = moment(_convertTimeFromFirstBlock(props.time));
  return (<span className={'date'}>{day.format('ll')}</span>);
});

export const TimeFromTimestamp = translate()((props) => {
  moment.locale(i18n.language);
  const day = moment(_convertTimeFromFirstBlock(props.time));
  return (<span className={'time'}>{day.format('LTS')}</span>);
});

export const TooltipTime = translate()((props) => {
  moment.locale(i18n.language);
  const time = moment(_convertTimeFromFirstBlock(props.label));
  return (<TooltipWrapper tooltip={time.format('LL LTS')} >
    <Time label={props.label} lang={props.lang}></Time>
  </TooltipWrapper>);
});

export const DateTimeFromTimestamp = translate()((props) => {
  moment.locale(i18n.language);
  const datetime = moment(_convertTimeFromFirstBlock(props.time));
  return (<span className={`${props.className || ''}`}>{
    props.fulltime ? (
      datetime.format('DD MMM YYYY, HH:mm:ss')
    )
    : datetime.calendar(null, {
        lastDay: props.t('[Yesterday], HH:mm'),
        sameDay: props.t('[Today], HH:mm'),
        nextDay: props.t('[Tomorrow], HH:mm'),
        lastWeek: props.t('DD MMM YYYY, HH:mm'),
        nextWeek: props.t('DD MMM YYYY, HH:mm'),
        sameElse: props.t('DD MMM YYYY, HH:mm'),
      })
  }</span>);
});
