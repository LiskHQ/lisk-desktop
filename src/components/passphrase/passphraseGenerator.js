import React from 'react';
import AnimateOnChange from 'react-animate-on-change';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Input from 'react-toolbox/lib/input';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase, emptyByte } from '../../utils/passphrase';
import styles from './passphrase.css';


const Byte = props => (
  <AnimateOnChange
    animate={props.diff}
    baseClassName={styles.stable}
    animationClassName={styles.bouncing}>
    <span className={styles.byte}>{ props.value }</span>
  </AnimateOnChange>
);

class PassphraseGenerator extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'info',
      lastCaptured: {
        x: 0,
        y: 0,
      },
      zeroSeed: emptyByte('00'),
      seedDiff: emptyByte(0),
    };
    this.seedGeneratorBoundToThis = this.seedGenerator.bind(this);
    document.addEventListener('mousemove', this.seedGeneratorBoundToThis, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.seedGeneratorBoundToThis, true);
  }

  /**
   * Tests useragent with a regexp and defines if the account is mobile device
   *
   * @param {String} [agent] - The useragent string, This parameter is used for
   *  unit testing purpose
   * @returns {Boolean} - whether the agent represents a mobile device or not
   */
  // it is on class so that we can mock it in unit tests
  // eslint-disable-next-line class-methods-use-this
  isTouchDevice(agent) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent || navigator.userAgent || navigator.vendor || window.opera));
  }

  seedGenerator(nativeEvent) {
    let shouldTrigger;
    if (typeof nativeEvent === 'string') {
      shouldTrigger = true;
    } else {
      const distance =
        Math.sqrt(((nativeEvent.pageX - this.state.lastCaptured.x) ** 2) +
        ((nativeEvent.pageY - this.state.lastCaptured.y) ** 2));
      shouldTrigger = distance > 120;
    }

    if (shouldTrigger && (!this.state.data || this.state.data.percentage < 100)) {
      this.setState({
        lastCaptured: {
          x: nativeEvent.pageX,
          y: nativeEvent.pageY,
        },
      });

      // defining diffSeed to use for animating HEX numbers
      // note: in the first iteration data is undefined
      const oldSeed = this.state.data ? this.state.data.seed : this.state.zeroSeed;
      const data = generateSeed(this.state.data);
      const seedDiff = oldSeed.map((item, index) =>
        ((item !== data.seed[index]) ? index : null))
        .filter(item => item !== null);
      this.setState({ data, seedDiff });
    } else if (this.state.data && this.state.data.percentage >= 100 && !this.state.passphrase) {
      // also change the step here
      const phrase = generatePassphrase(this.state.data);
      this.setState({
        passphrase: phrase,
      });
      this.props.changeHandler('passphrase', phrase);
      this.props.changeHandler('current', 'show');
    }
  }

  render() {
    return (
      <div className={`${grid.row} ${grid['center-xs']}`} >
        <div className={grid['col-xs-12']}>
          {this.isTouchDevice() ?
            <div>
              <p>Enter text below to generate random bytes</p>
              <Input onChange={this.seedGeneratorBoundToThis}
                className='touch-fallback' autoFocus={true} multiline={true} />
            </div> :
            <p>Move your mouse to generate random bytes</p>
          }
        </div>
        <div className={grid['col-xs-12']}>
          <ProgressBar mode='determinate'
            value={this.state.data ? this.state.data.percentage : 0} />
        </div>
        <div className={grid['col-xs-12']}>
          {
            (this.state.data ? this.state.data.seed : this.state.zeroSeed)
              .map((byte, index) => (
                <Byte value={byte} key={index} diff={this.state.seedDiff.indexOf(index) >= 0} />
              ))
          }
        </div>
      </div>
    );
  }
}

export default PassphraseGenerator;
