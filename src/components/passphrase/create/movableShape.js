import { css, tween, easing } from 'popmotion';
import React from 'react';

class MovableShape extends React.Component {
  constructor() {
    super();
    this.progress = 0;
    this.totalSteps = 100;
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

  render() {
    const { className, src } = this.props;

    return <img
      style = { this.state.style }
      className={className}
      ref={(input) => { this.shape = input; }}
      src={src} />;
  }
}

export default MovableShape;
