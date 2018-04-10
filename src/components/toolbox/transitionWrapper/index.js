import React from 'react';
import styles from './transitionWrapper.css';

class TransitionWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      extraProps: {
        className: styles.willTransition,
      },
    };

    this.cssStyleRules = {
      in: styles.slideIn,
      out: styles.slideOut,
      duration: 400,
    };
  }

  componentWillMount() {
    this.validateChildren();

    if (styles[`${this.props.animationName}In`]) {
      this.cssStyleRules.in = styles[`${this.props.animationName}In`];
      this.cssStyleRules.out = styles[`${this.props.animationName}Out`];
    }

    if (this.props.current === this.props.step) {
      this.transitionIn(true);
    }
  }
  validateChildren() {
    /* istanbul ignore if */
    if (this.props.children instanceof Array && this.props.children.length !== 1) {
      throw Error('TransitionWrapper must have exactly one child');
    }
  }

  componentWillUpdate(newProps) {
    const steps = this.props.step.split(',');
    if (steps.includes(newProps.current) && !steps.includes(this.props.current)) {
      this.transitionIn(newProps);
    } else if (!steps.includes(newProps.current) && steps.includes(this.props.current)) {
      this.transitionOut(newProps);
    }
  }

  transitionIn(AddWillTransition) {
    this.timeout = setTimeout(() => {
      const className = `${this.props.children.props.className} ${AddWillTransition ? styles.willTransition : ''} ${this.cssStyleRules.in}`;
      const extraProps = Object.assign({}, this.state.extraProps);
      extraProps.className = className;
      this.setState({ extraProps });
    }, this.cssStyleRules.duration);
  }

  transitionOut() {
    const extraProps = Object.assign({}, this.state.extraProps);
    let className = extraProps.className.replace(this.cssStyleRules.in, '').trim();

    className = `${className} ${this.cssStyleRules.out}`;

    extraProps.className = className;
    this.setState({ extraProps });
    this.setStable();
  }

  setStable() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const extraProps = Object.assign({}, this.state.extraProps);
      extraProps.className = extraProps.className
        .replace(this.cssStyleRules.in, '').replace(this.cssStyleRules.out, '').trim();
      this.setState({ extraProps });
    }, this.cssStyleRules.duration);
  }

  render() {
    const inlineStyles = {};

    if (this.props.animationDuration) {
      inlineStyles.style = {
        animationDuration: this.props.animationDuration || `${this.cssStyleRules.duration}ms`,
        WebkitAnimationDuration: this.props.animationDuration || `${this.cssStyleRules.duration}ms`,
      };
    }

    return React.cloneElement(this.props.children,
      Object.assign({}, this.state.extraProps, inlineStyles));
  }
}

export default TransitionWrapper;
