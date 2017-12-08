import { css, tween, easing } from 'popmotion';
import React from 'react';

class MovableShape extends React.Component {
  constructor() {
    super();
    this.progress = 0;
  }

  componentDidMount() {
    const { end, reverse } = this.props;
    this.direction = reverse ? -1 : 1;
    this.shapeRenderer = css(this.shape);
    this.tween = tween({
      to: 100,
      duration: 30,
      ease: easing.easeInOut,
      onUpdate: (x) => {
        const point = x / 100;
        this.progress = x;
        this.shapeRenderer.set('y', end.y * point * -1);
        this.shapeRenderer.set('x', end.x * point * this.direction);
      },
    });
  }

  shouldComponentUpdate(nextProps) {
    this.moveShape(nextProps.percentage);
    if (nextProps.hidden === 0) {
      return true;
    }
    return false;
  }

  moveShape(percentage) {
    if (percentage % 4 > 2 && percentage % 4 !== 0) {
      this.tween.setProps({
        from: this.progress,
        to: percentage,
        duration: 200,
      });
      this.tween.start();
    }
  }

  render() {
    const { className, src, hidden } = this.props;
    return <img
      style = {{ opacity: hidden }}
      className={className}
      ref={(input) => { this.shape = input; }}
      src={src} />;
  }
}

export default MovableShape;
