import { css, tween, easing } from 'popmotion';


class AnimateShape {
  constructor(end, shapeId, reverse) {
    this.direction = reverse ? -1 : 1;
    this.shape = document.querySelector(shapeId);
    this.shapeRenderer = css(this.shape);
    this.state = 0;
    this.tween = tween({
      to: 100,
      duration: 30,
      ease: easing.easeInOut,
      onUpdate: (x) => {
        const point = x / 100;
        this.state = x;
        this.shapeRenderer.set('y', end.y * point * -1);
        this.shapeRenderer.set('x', end.x * point * this.direction);
      },
    });
  }

  css(rule, value) {
    this.shapeRenderer.set(rule, value);
  }

  startMovement(percentage) {
    // console.log(percentage);
    this.stopFlag = false;
    this.tween.setProps({
      from: this.state,
      to: percentage,
      duration: 400,
    });
    this.tween.start();
  }
}

export default AnimateShape;
