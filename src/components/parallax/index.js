import React from 'react';
import ParallaxJs from 'parallax-js';
import options from './options';

class Parallax extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    const settings = {};
    Object.keys(this.props).forEach((prop) => {
      if (options.includes(prop)) {
        settings[prop] = this.props[prop];
      }
    });

    this.parallaxInstance = new ParallaxJs(this.wrapper, settings);
  }

  render() {
    return (<div
      className={this.props.className}
      ref={(el) => { this.wrapper = el; }}>{this.props.children}</div>);
  }
}

export default Parallax;
