import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './passphrase.css';
import Input from '../toolbox/inputs/input';
import ActionBar from '../actionBar';
import PassphraseTheme from './passphraseTheme';

class PassphraseValidator extends React.Component {
  constructor() {
    super();
    this.state = {
      passphraseParts: [],
    };
  }

  componentDidMount() {
    // this.props.randomIndex is used in unit teasing
    this.hideRandomWord.call(this, this.props.randomIndex);
  }

  hideRandomWord(rand = Math.random()) {
    const words = this.props.passphrase.trim().split(/\s+/).filter(item => item.length > 0);
    const index = Math.floor(rand * (words.length - 1));

    this.setState({
      passphraseParts: this.props.passphrase.split(words[index]),
      missing: words[index],
      answer: '',
    });
  }

  changeHandler(answer) {
    this.setState({ answer });
  }

  // eslint-disable-next-line
  focus({ nativeEvent }) {
    nativeEvent.target.focus();
  }

  render() {
    return (
      <div>
        <PassphraseTheme>
          <div className={`passphrase-verifier ${grid.row} ${grid['start-xs']}`}>
            <div className={grid['col-xs-12']}>
              <p className='passphrase-holder'>
                <span>{this.state.passphraseParts[0]}</span>
                <span className={styles.missing}>-----</span>
                <span>{this.state.passphraseParts[1]}</span>
              </p>
            </div>
            <div className={grid['col-xs-12']}>
              <Input type='text' label={this.props.t('Enter the missing word')}
                autoFocus
                onBlur={this.focus.bind(this)}
                onChange={this.changeHandler.bind(this)} />
            </div>
          </div>
        </PassphraseTheme>

        <ActionBar
          secondaryButton={{
            label: this.props.t('Back'),
            onClick: this.props.prevStep,
          }}
          primaryButton={{
            label: this.props.t(this.props.confirmButton),
            className: 'next-button',
            disabled: this.state.answer !== this.state.missing,
            onClick: () => {
              this.props.onPassGenerated(this.props.passphrase);
            },
          }} />
      </div>
    );
  }
}

export default PassphraseValidator;
