import React from 'react';
import AnimateOnChange from 'react-animate-on-change';
import ProgressBar from 'react-toolbox/lib/progress_bar';
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

  seedGenerator({ nativeEvent }) {
    const distance =
      Math.sqrt(((nativeEvent.pageX - this.state.lastCaptured.x) ** 2) +
      ((nativeEvent.pageY - this.state.lastCaptured.y) ** 2));

    if (distance > 120 && (!this.state.data || this.state.data.percentage < 100)) {
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
          <p>Move your mouse to generate random bytes</p>
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
