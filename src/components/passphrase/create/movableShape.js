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
    const { zIndex } = this.props;
    const style = Object.assign(
      { zIndex },
      { left: this.props.initial[0], bottom: this.props.initial[1] },
    );
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

  getColors() {
    const { percentage } = this.props;
    const { foreground: fg, background: bg } = schemes[0];
    const progressOffset = Math.floor(Math.min(percentage, 90) / this.threshold);
    const backGroundIndex = this.props.backGroundIndex + progressOffset;
    const foreGroundIndex = this.props.foreGroundIndex + progressOffset;

    return {
      bg: {
        x: bg[backGroundIndex % bg.length][0],
        y: bg[backGroundIndex % bg.length][1],
      },
      fg: {
        x: fg[foreGroundIndex % fg.length][0],
        y: fg[foreGroundIndex % fg.length][1],
      },
    };
  }

  render() {
    const {
      className, group, width, height, idBg, idFg,
    } = this.props;
    const toggleShape = () =>
      (this.props.percentage > 80 ? false : Math.floor((this.props.percentage / 10)) % 2);

    return <div style = { this.state.style }

      className={`${toggleShape() ? styles.switch : null}
      ${this.props.percentage >= 90 ? styles.faceOutShape : null}
      ${className}`}
      ref={(input) => { this.shape = input; }}>
      <svg width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient x1="19%" y1="88%" x2="86%" y2="18%" id={idBg}>
            <stop stopColor={this.getColors().fg.x} offset="0%">
            </stop>
            <stop stopColor={this.getColors().fg.y} offset="100%">
            </stop>
          </linearGradient>
          <linearGradient x1="19%" y1="88%" x2="86%" y2="18%" id={idFg}>
            <stop stopColor={this.getColors().bg.x} offset="0%">
            </stop>
            <stop stopColor={this.getColors().bg.y} offset="100%">
            </stop>
          </linearGradient>
        </defs>
        {group}
      </svg>
    </div>;
  }
}

export default MovableShape;
