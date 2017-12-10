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
      words: [],
      missing: [],
      answers: [],
    };
  }

  componentDidMount() {
    // this.props.randomIndex is used in unit teasing
    this.hideRandomWord.call(this);
  }

  hideRandomWord() {
    const words = this.props.passphrase.match(/\w+/g);
    const indexByRand = num => Math.floor(num * (words.length - 1));

    /**
     * Returns a random index which doesn't exist in list
     * 
     * @param {Array} list - The list of existing random Indexes
     * @returns {Number} random index between 0 and length of words
     */
    const randomIndex = (list) => {
      let index;
      do {
        index = indexByRand(Math.random());
      }
      while (list.includes(index));
      return index;
    };

    /**
     * Returns a number of random indexes within 0 and the length of words
     * @param {Number} qty - the number of random indexes required
     * @returns {Array} the list of random indexes
     */
    const chooseRandomWords = (qty) => {
      const missing = [];

      for (let i = 0; i < qty; i++) {
        missing.push(randomIndex(missing));
      }

      return missing;
    };

    this.setState({
      words,
      missing: chooseRandomWords(2),
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
    console.log(this.state);
    return (
      <div>
        <PassphraseTheme>
          <div className={`passphrase-verifier ${grid.row} ${grid['start-xs']}`}>
            <div className={grid['col-xs-12']}>
              <header>
                <h2>Choose the correct phrases to confirm.</h2>
              </header>
              <p className='passphrase-holder'>
                {
                  this.state.words.map((word, index) => {
                    if (!this.state.missing.includes(index)) {
                      return (<span key={word}>{word}</span>);
                    }
                    return (<span key={word} className={styles.missingWord}></span>);
                  })
                }
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
              this.props.finalCallback(this.props.passphrase);
            },
          }} />
      </div>
    );
  }
}

export default PassphraseValidator;
