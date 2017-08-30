import React from 'react';
import Input from 'react-toolbox/lib/input';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './passphrase.css';

class PassphraseConfirmator extends React.Component {
  constructor() {
    super();
    this.state = {
      passphraseParts: [],
    };
  }

  componentDidMount() {
    this.props.updateAnswer(false);
    this.state = {
      passphraseParts: this.hideRandomWord.call(this),
    };
  }

  hideRandomWord(rand = Math.random()) {
    const words = this.props.passphrase.trim().split(/\s+/);
    const index = Math.floor(rand * (words.length - 1));

    this.setState({
      passphraseParts: this.props.passphrase.split(` ${words[index]} `),
      missing: words[index],
      answer: '',
    });
  }

  changeHandler(value) {
    this.props.updateAnswer(value === this.state.missing);
  }

  // eslint-disable-next-line
  focus({ nativeEvent }) {
    nativeEvent.target.focus();
  }

  render() {
    return (
      <div className={`passphrase-verifier ${grid.row} ${grid['start-xs']}`}>
        <div className={grid['col-xs-12']}>
          <p>
            <span>{this.state.passphraseParts[0]}</span>
            <span className={styles.missing}>-----</span>
            <span>{this.state.passphraseParts[1]}</span>
          </p>
        </div>
        <div className={grid['col-xs-12']}>
          <Input type='text' label='Enter the missing word'
            autoFocus
            onBlur={this.focus.bind(this)}
            onChange={this.changeHandler.bind(this)} />
        </div>
      </div>
    );
  }
}

export default PassphraseConfirmator;
