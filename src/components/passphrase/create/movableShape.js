import { css, tween, easing } from 'popmotion';
import React from 'react';
import styles from './shapes.css';
import schemes from './colorSchemes';

class MovableShape extends React.Component {
  constructor(props) {
    super(props);
    this.progress = 0;
    this.totalSteps = 100;
    this.threshold = 20;
    this.backGroundIndex = props.backGroundIndex;
    this.foreGroundIndex = props.foreGroundIndex;
    this.state = {
      style: {
        opacity: 0,
      },
    };
  }

  componentDidMount() {
    this.allocateShape.call(this);
    const { initial } = this.props;
    this.configs = {
      left: {
        initial: parseFloat(initial[0], 10),
        step: (50 - parseFloat(initial[0], 10)) / 100,
        alpha: parseFloat(initial[0], 10) > 50 ? -1 : 1,
      },
      bottom: {
        initial: parseFloat(initial[1], 10),
        step: (50 - parseFloat(initial[1], 10)) / 100,
        alpha: parseFloat(initial[1], 10) > 50 ? -1 : 1,
      },
    };

    this.shapeRenderer = css(this.shape);
    this.tween = tween({
      to: this.totalSteps,
      duration: 30,
      ease: easing.easeInOut,
      onUpdate: (x) => {
        const nextLeft = this.configs.left.initial +
          (this.props.percentage * this.configs.left.step);
        const nextBottom = this.configs.bottom.initial +
          (this.props.percentage * this.configs.bottom.step);
        this.progress = x;
        this.shapeRenderer.set('bottom', `${nextBottom}%`);
        this.shapeRenderer.set('left', `${nextLeft}%`);
      },
    });
  }

  allocateShape() {
    const { hidden } = this.props;
    const style = Object.assign({ opacity: hidden },
      { left: this.props.initial[0], bottom: this.props.initial[1] });
    this.setState({ style });
  }

  shouldComponentUpdate(nextProps) {
    this.moveShape(nextProps.percentage);
    if (nextProps.hidden === 0) {
      return false;
    }
    return true;
  }

  moveShape(percentage) {
    if (Math.floor(percentage) % 4 !== 0) {
      this.tween.setProps({
        from: this.progress,
        to: percentage,
        duration: 200,
      }).start();
    }
  }

  setIndex(key, length) {
    if (this[key] === length) {
      this[key] = 0;
    } else {
      this[key]++;
    }
  }

  distributeColors() {
    const { percentage } = this.props;
    const { foreground: fg, background: bg } = schemes[0];

    const pattern = {
      bg: { x: bg[this.backGroundIndex][0], y: bg[this.backGroundIndex][1] },
      fg: { x: fg[this.foreGroundIndex][0], y: fg[this.foreGroundIndex][1] },
    };

    if (percentage > this.threshold && percentage < 90) {
      this.threshold += 10;
      this.setIndex('foreGroundIndex', fg.length - 1);
      this.setIndex('backGroundIndex', bg.length - 1);
    }

    return pattern;
  }

  render() {
    const { className, group, width, height, viewBox, idBg, idFg } = this.props;
    const toggleShape = () =>
      (this.props.percentage > 80 ? false : Math.floor((this.props.percentage / 10)) % 2);

    return <div style = { this.state.style }

      className={`${toggleShape() ? styles.switch : null} ${className}`}
      ref={(input) => { this.shape = input; }}>
      <svg width={width} height={height} viewBox={viewBox}>
        <defs>
          <linearGradient x1="19%" y1="88%" x2="86%" y2="18%" id={idBg}>
            <stop stopColor={this.distributeColors().fg.x} offset="0%">
            </stop>
            <stop stopColor={this.distributeColors().fg.y} offset="100%">
            </stop>
          </linearGradient>
          <linearGradient x1="19%" y1="88%" x2="86%" y2="18%" id={idFg}>
            <stop stopColor={this.distributeColors().bg.x} offset="0%">
            </stop>
            <stop stopColor={this.distributeColors().bg.y} offset="100%">
            </stop>
          </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.8">
          {group}
        </g>
      </svg>
    </div>;
  }
}

export default MovableShape;
