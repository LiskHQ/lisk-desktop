import React from 'react';
import styles from './checkbox.css';

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
    this.maxMovement = this.parent.offsetWidth - this.shape.offsetWidth;
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
    this.maxMovement = this.parent.offsetWidth - (this.shape.offsetWidth * this.direction);
  }

  revert() {
    this.shape.removeAttribute('style');
  }

  track(e) {
    if (this.trackable) {
      this.delta = e.nativeEvent.clientX - this.xOffset;
      const left = this.direction > 0 ? this.delta : (this.maxMovement - Math.abs(this.delta));

      if ((this.direction * this.delta) > 0 &&
        Math.abs(this.delta) < this.maxMovement) {
        this.shape.setAttribute('style', `left: ${left}px`);
      }
    }
  }

  render() {
    const { label, input, icons, className, hasSlidingArrows } = this.props;

    return (<div className={`${styles.sliderInput} ${className}`}>
      <input type='checkbox' value={input.value}
        ref={(el) => { this.input = el; }}/>
      <label ref={(el) => { this.parent = el; }}
        onMouseDown={this.startTracking.bind(this)}
        onMouseMove={this.track.bind(this)}
        onMouseLeave={this.stopTracking.bind(this)}
        onMouseUp={this.stopTracking.bind(this)}>
        <span
          className={`${styles.circle} ${styles.button}`}
          ref={(el) => { this.shape = el; }}>
          <i className={`material-icons ${styles.icon} ${styles.arrowRight}`}>chevron_right</i>
          <i className={`material-icons ${styles.icon} ${styles.checkMark}`}>{icons.done}</i>
        </span>
        <div className={hasSlidingArrows ? styles.hasArrows : ''}>
          <span>{label}</span>
        </div>
        {
          typeof icons.goal === 'string' ?
            <span className={`${styles.circle} ${styles.lock}`}>
              <i className={`material-icons ${styles.icon} ${styles.arrowRight}`}>{icons.goal}</i>
            </span> : null
        }
      </label>
    </div>);
  }
}

export default SliderCheckbox;
