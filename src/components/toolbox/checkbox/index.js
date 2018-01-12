import React from 'react';
import { themr } from 'react-css-themr';
import styles from './checkbox.css';
import { FontIcon } from '../../fontIcon';

class SliderCheckbox extends React.Component {
  constructor() {
    super();

    this.state = {
      xOffset: 0,
    };

    this.xOffset = 0;
    this.delta = 0;
  }

  startTracking(e) {
    this.trackable = true;
    this.xOffset = e.nativeEvent.clientX;
    this.direction = this.input.checked ? -1 : 1;
    this.setState({
      maxMovement: this.parent.getBoundingClientRect().width -
      this.shape.getBoundingClientRect().width,
    });
  }

  stopTracking() {
    if (this.trackable) {
      this.trackable = false;

      if (Math.abs(this.delta) > 50) {
        this.change();
      } else {
        this.revert();
      }
      this.delta = 0;
    }
  }

  change() {
    // this.shape.setAttribute('style', `left: ${this.maxMovement}px`);
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

  track(e) {
    if (this.trackable) {
      this.delta = e.nativeEvent.clientX - this.xOffset;
      const left = this.direction > 0
        ? this.delta
        : (this.state.maxMovement - Math.abs(this.delta));

      if ((this.direction * this.delta) > 0 &&
        Math.abs(this.delta) < this.state.maxMovement) {
        this.shape.setAttribute('style', `left: ${left}px`);
      }
    }
  }

  render() {
    const { label, input, className, hasSlidingArrows, theme, clickable, textAsIcon } = this.props;
    const icons = this.props.icons ? this.props.icons : {};
    return (<div className={`${theme.sliderInput} ${className}`}>
      <input type='checkbox' value={input.value} checked={input.checked}
        ref={(el) => { this.input = el; }} onChange={this.change.bind(this)}/>
      <label ref={(el) => { this.parent = el; }}
        onMouseDown={this.startTracking.bind(this)}
        onMouseMove={this.track.bind(this)}
        onMouseLeave={this.stopTracking.bind(this)}
        onMouseUp={this.stopTracking.bind(this)}>
        <span
          onClick= {clickable ?
            this.change.bind(this) :
            null
          }
          className={`${theme.circle} ${theme.button} circle`}
          ref={(el) => { this.shape = el; }}>
          <span className={theme.arrowRight}>
            {textAsIcon ?
              <span className={theme.text}>{icons.start}</span> :
              <FontIcon className={theme.icon}>
                {icons.start || 'arrow-right'}
              </FontIcon>
            }
          </span>

          <span className={theme.checkMark}>
            {textAsIcon ?
              <span className={theme.text}>{icons.done}</span> :
              <FontIcon className={theme.icon}>
                {icons.done || 'checkmark'}
              </FontIcon>
            }
          </span>
        </span>
        {label ? <div className={hasSlidingArrows ? theme.hasArrows : ''}>
          <span>{label}</span>
        </div> : ''}
        {
          typeof icons.begin === 'string' ?
            <span
              onClick= {clickable ?
                this.change.bind(this) :
                null
              }
              className={`${theme.circle} ${theme.begin}`}>
              {textAsIcon ? icons.begin :
                <FontIcon className={`${theme.icon} ${theme.arrowRight}`}>{icons.goal}</FontIcon>
              }
            </span> : null
        }
        {
          typeof icons.goal === 'string' ?
            <span
              onClick= {clickable ?
                this.change.bind(this) :
                null
              }
              className={`${theme.circle} ${theme.goal}`}>
              {textAsIcon ? icons.goal :
                <FontIcon className={`${theme.icon} ${theme.arrowRight}`}>{icons.goal}</FontIcon>
              }
            </span> : null
        }
      </label>
    </div>);
  }
}

export { SliderCheckbox };
export default themr('sliderCheckbox', styles)(SliderCheckbox);
