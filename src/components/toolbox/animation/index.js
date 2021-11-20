import React from 'react';
import PropTypes from 'prop-types';
import lottie from 'lottie-web';

import delegateCreated from '../../../assets/animations/delegate-created.json';
import delegatePending from '../../../assets/animations/delegate-pending.json';
import delegateConfirmed from '../../../assets/animations/delegate-confirmed.json';
import delegateDeclined from '../../../assets/animations/delegate-declined.json';

export const animations = {
  delegateCreated,
  delegatePending,
  delegateConfirmed,
  delegateDeclined,
};

class Animation extends React.Component {
  componentDidMount() {
    this.loadAnimation();
    this.bindListeners();
  }

  loadAnimation() {
    const {
      name,
      loop,
      autoplay,
      renderer,
    } = this.props;
    this.options = {
      container: this.el,
      animationData: animations[name],
      segments: false,
      name,
      renderer,
      autoplay,
      loop,
    };
    this.anim = lottie.loadAnimation(this.options);
  }

  bindListeners() {
    const { events } = this.props;
    Object.keys(events).forEach(event =>
      this.anim.addEventListener(event, events[event]));
  }

  unbindListeners() {
    const { events } = this.props;
    Object.keys(events).forEach(event =>
      this.anim.removeEventListener(event, events[event]));
  }

  destroy() {
    this.anim.destroy();
    this.anim = null;
  }

  componentDidUpdate(prevProps) {
    const { name } = this.props;
    const prevName = prevProps.name;
    if (name !== prevName) {
      this.unbindListeners();
    }
    this.destroy();
    this.loadAnimation();
    this.bindListeners();
  }

  componentWillUnmount() {
    this.unbindListeners();
    this.destroy();
  }

  render() {
    const { className } = this.props;
    return (
      <div
        className={className}
        ref={(el) => { this.el = el; }}
      />
    );
  }
}

Animation.propTypes = {
  name: PropTypes.oneOf(Object.keys(animations)).isRequired,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  renderer: PropTypes.oneOf(['svg', 'canvas', 'html']),
  className: PropTypes.string,
  events: PropTypes.shape({
    complete: PropTypes.func,
    enterFrame: PropTypes.func,
    segmentStart: PropTypes.func,
  }),
};

Animation.defaultProps = {
  loop: true,
  autoplay: true,
  renderer: 'svg',
  className: '',
  events: {},
};

export default Animation;
