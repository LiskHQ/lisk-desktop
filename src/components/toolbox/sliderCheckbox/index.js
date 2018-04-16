import React from 'react';
import { themr } from 'react-css-themr';
import styles from './checkbox.css';
import { FontIcon } from '../../fontIcon';

const StaticLabel = ({ theme, icons, iconName }) => (
  <span className={`${theme.circle} ${theme[iconName]}`}>
    <FontIcon className={`${theme.icon} ${theme.arrowRight}`}>{icons[iconName]}</FontIcon>
  </span>
);
class SliderCheckbox extends React.Component {
  constructor() {
    super();

    this.state = {
      xOffset: 0,
    };

    this.xOffset = 0;
    this.delta = 0;
    this.arrows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  // eslint-disable-next-line class-methods-use-this
  getXOffset(e) {
    const ev = e.nativeEvent;
    if (typeof ev.pageX === 'number') {
      return ev.pageX;
    } else if (ev.changedTouches && ev.changedTouches[0]) {
      return ev.changedTouches[0].pageX;
    }
    return ev.clientX;
  }

  startTracking(e) {
    this.trackable = true;
    this.xOffset = this.getXOffset(e);
    this.direction = this.input.checked ? -1 : 1;
    /* istanbul ignore next */
    const sliderWidth = this.props.sliderWidth || this.parent.getBoundingClientRect().width;
    /* istanbul ignore next */
    this.buttonWidth = this.props.buttonWidth || this.shape.getBoundingClientRect().width;
    this.maxMovement = sliderWidth - this.buttonWidth;
  }

  track(e) {
    if (this.trackable) {
      const pageX = this.getXOffset(e);
      this.delta = pageX - this.xOffset;
      const left = this.direction > 0
        ? this.delta
        : ((this.maxMovement + this.buttonWidth) - Math.abs(this.delta));

      if ((this.direction * this.delta) > 0 &&
        Math.abs(this.delta) < this.maxMovement) {
        this.shape.setAttribute('style', `left: ${left}px`);
      }
    }
  }

  stopTracking() {
    if (this.trackable) {
      this.trackable = false;
      // delta === 0 covers clicking
      if ((this.delta === 0 || Math.abs(this.delta) > 50) && !this.props.disabled) {
        this.change();
      } else {
        this.revert();
      }
      this.delta = 0;
    }
  }

  change() {
    this.input.checked = !this.input.checked;
    this.shape.removeAttribute('style');
    this.direction = this.input.checked ? -1 : 1;
    if (typeof this.props.onChange === 'function' &&
      this.props.input instanceof Object &&
      !(this.props.input instanceof Array)) {
      this.props.onChange({
        checked: this.input.checked,
        value: this.props.input.value,
      });
    }
  }

  revert() {
    this.shape.removeAttribute('style');
  }

  render() {
    const { label, input, className, hasSlidingArrows, theme } = this.props;
    const icons = this.props.icons ? this.props.icons : {};

    const checkType = i => (typeof i === 'string');

    return (<div className={`${theme.sliderInput} ${className}`}>
      <input type='checkbox' value={input.value}
        disabled={this.props.disabled} checked={input.checked}
        ref={(el) => { this.input = el; }} onChange={this.change.bind(this)}/>
      <label ref={(el) => { this.parent = el; }}
        onMouseDown={this.startTracking.bind(this)}
        onTouchStart={this.startTracking.bind(this)}
        onMouseMove={this.track.bind(this)}
        onTouchMove={this.track.bind(this)}
        onMouseLeave={this.stopTracking.bind(this)}
        onMouseUp={this.stopTracking.bind(this)}
        onClick={e => e.stopPropagation()}
        onTouchEnd={this.stopTracking.bind(this)}>
        <span
          className={`${theme.circle} ${theme.button} circle`}
          ref={(el) => { this.shape = el; }}>
          <span className={theme.arrowRight}>
            <FontIcon className={theme.icon}>
              {icons.unchecked || 'arrow-right'}
            </FontIcon>
          </span>

          <span className={theme.checkMark}>
            <FontIcon className={theme.icon}>
              {icons.checked || 'checkmark'}
            </FontIcon>
          </span>
        </span>
        { label ?
          <div>
            <span className='label'>{label}</span>
            {
              hasSlidingArrows ?
                <span className={`${styles.arrows} arrow`}>
                  { this.arrows.map(key => <FontIcon key={key} value='arrow-right' />) }
                </span> : null
            }
          </div> : ''
        }
        {
          checkType(icons.begin) ?
            <StaticLabel theme={theme} icons={icons} iconName='begin' /> : null
        }
        {
          checkType(icons.goal) ?
            <StaticLabel theme={theme} icons={icons} iconName='goal' /> : null
        }
      </label>
    </div>);
  }
}

export { SliderCheckbox };
export default themr('sliderCheckbox', styles)(SliderCheckbox);
