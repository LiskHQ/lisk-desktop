import React from 'react';
import moment from 'moment';
import Tooltip from 'react-toolbox/lib/tooltip';
// import omit from 'lodash/omit';
import theme from 'react-toolbox/lib/tooltip/theme.css';

const _fix = value => new Date((((Date.UTC(2016, 4, 24, 17, 0, 0, 0) / 1000) + value) * 1000));
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

export const Time = (props) => {
  const time = moment(_fix(props.label));
  return <span>{time.fromNow(true)}</span>;
};

export const TooltipTime = (props) => {
  const time = moment(_fix(props.label));
  return <TooltipWrapper tooltip={time.format('LL LTS')} ><Time label={props.label}></Time></TooltipWrapper>;
};
