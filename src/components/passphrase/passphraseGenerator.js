import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generateSeed, generatePassphrase } from '../../utils/passphrase';
import styles from './passphrase.css';

class PassphraseGenerator extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'info',
      lastCaptured: {
        x: 0,
        y: 0,
      },
      zeroSeed: ['00', '00', '00', '00', '00', '00', '00', '00',
        '00', '00', '00', '00', '00', '00', '00', '00'],
    };
  }

  seedGenerator({ nativeEvent }) {
    const distance =
      Math.sqrt(Math.pow(nativeEvent.pageX - this.state.lastCaptured.x, 2) +
      (Math.pow(nativeEvent.pageY - this.state.lastCaptured.y), 2));

    if (distance > 120 && (!this.state.data || this.state.data.percentage < 100)) {
      this.setState({
        lastCaptured: {
          x: nativeEvent.pageX,
          y: nativeEvent.pageY,
        },
      });

      // in the first iteration data is undefined
      this.setState({ data: generateSeed(this.state.data) });
    } else if (this.state.data && this.state.data.percentage >= 100 && !this.state.passphrase) {
      // also change the step here
      const phrase = generatePassphrase(this.state.data);
      this.setState({
        passphrase: phrase,
      });
      this.props.changeHandler('passphrase', phrase);
      this.props.changeHandler('currentStep', 'show');
    }
  }

  render() {
    return (
      <div className={`${grid.row} ${grid['center-xs']}`} onMouseMove={this.seedGenerator.bind(this)}>
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
                <span className={styles.byte} key={index}>{ byte }</span>
              ))
          }
        </div>
      </div>
    );
  }
}

export default PassphraseGenerator;
