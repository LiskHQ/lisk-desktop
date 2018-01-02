import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import styles from './confirm.css';
import { PrimaryButton } from '../../toolbox/buttons/button';
import circle from '../../../assets/images/circle.svg';
import { extractAddress } from '../../../utils/api/account';
import TransitionWrapper from '../../toolbox/transitionWrapper';

class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'verify',
      numberOfOptions: 3,
      words: [],
      missing: [],
      answers: [],
    };
  }

  componentDidMount() {
    // this.props.randomIndex is used in unit teasing
    this.hideRandomWord.call(this);
    this.address = this.getAddress();
  }

  componentDidUpdate() {
    const status = this.formStatus(this.state.answers);
    if (this.state.step === 'verify' && status.filled && status.valid) {
      this.next();
    }
  }

  onWordSelected(e) {
    const index = e.nativeEvent.target.getAttribute('answer');
    const answers = [...this.state.answers];
    answers[index] = {
      value: e.nativeEvent.target.value,
      validity: e.nativeEvent.target.value === this.state.words[this.state.missing[index]],
    };

    const formValidity = this.formStatus(answers).valid;
    this.setState({ answers, formValidity });
  }

  // eslint-disable-next-line class-methods-use-this
  formStatus(answers) {
    const formStatus = answers.reduce((status, answer) =>
      // eslint-disable-next-line eqeqeq
      ({
        valid: (status.valid && answer instanceof Object && answer.validity === true),
        filled: answer instanceof Object ? status.filled + 1 : status.filled,
      }), { valid: true, filled: 0 });
    formStatus.filled = formStatus.filled === this.state.missing.length;
    return formStatus;
  }

  next() {
    setTimeout(() => {
      this.setState({ step: 'done' });
    }, 500);
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

      return missing.sort((a, b) => a > b);
    };

    const missing = chooseRandomWords(2);
    const wordOptions = this.assembleWordOptions(words, missing);

    this.setState({
      words,
      missing,
      wordOptions,
    });
  }

  assembleWordOptions(passphraseWords, missingWords) {
    const getRandomWord = () => {
      let rand;

      do {
        rand = Math.floor(Math.random() * 2048);
      }
      while (passphraseWords.includes(fillWordsList[rand]));

      return fillWordsList[rand];
    };

    const mixWithMissingWords = (options) => {
      options.forEach((list, listIndex) => {
        const rand = Math.floor(Math.random() * list.length);
        list[rand] = passphraseWords[missingWords[listIndex]];
      });

      return options;
    };

    const wordOptions = [];
    for (let i = 0; i < missingWords.length; i++) {
      wordOptions[i] = [];
      for (let j = 0; j < this.state.numberOfOptions; j++) {
        wordOptions[i][j] = getRandomWord();
      }
    }

    return mixWithMissingWords(wordOptions);
  }

  changeHandler(answer) {
    this.setState({ answer });
  }

  // eslint-disable-next-line  class-methods-use-this
  focus({ nativeEvent }) {
    nativeEvent.target.focus();
  }

  getAddress() {
    return extractAddress(this.props.passphrase);
  }

  render() {
    let missingWordIndex = -1;
    const { missing, words, wordOptions, step, answers } = this.state;
    const formStatus = this.formStatus(answers);

    return (
      <section className={`passphrase-verifier ${styles.verifier} ${styles[step]}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='verify'>
              <h2 className={styles.verify}>{this.props.t('Choose the correct phrases to confirm.')}</h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='done'>
              <h2 className={styles.done}>{this.props.t('Awesome! You’re all set.')}</h2>
            </TransitionWrapper>
            <TransitionWrapper current={this.state.step} step='verify'>
              <h5 className={`${styles.verify} ${(formStatus.filled && !formStatus.valid) ? styles.visible : ''}`}>
                {this.props.t('Please go back and check your passphrase again.')}
              </h5>
            </TransitionWrapper>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify}`}>
          <div className={styles.tableCell}>
            <form className={`passphrase-holder ${(formStatus.filled && formStatus.valid) ? styles.validForm : ''}`}>
              {
                wordOptions ?
                  words.map((word, index) => {
                    if (!missing.includes(index)) {
                      return (<span key={word} className={styles.word}>{word}</span>);
                    }
                    missingWordIndex++;
                    return (
                      <fieldset key={word}>
                        <span className={styles.placeholder}></span>
                        {
                          wordOptions[missingWordIndex].map(wd =>
                            <div key={wd}>
                              <input
                                name={`answer${missingWordIndex}`}
                                answer={missingWordIndex}
                                type='radio' value={wd}
                                id={wd}
                                onChange={this.onWordSelected.bind(this)} />
                              <label htmlFor={wd}>{wd}</label>
                            </div>)
                        }
                      </fieldset>
                    );
                  }) : null
              }
            </form>
          </div>
        </section>
        <section className={`${styles.table} ${styles.done}`}>
          <div className={styles.tableCell}>
            <figure>
              <img src={circle} alt='Address avatar' />
            </figure>
            <h4 className={styles.address}>{this.address}</h4>
            <PrimaryButton
              theme={styles}
              label={this.props.t('Get to your Dashboard')}
              className="get-to-your-dashboard-button"
              onClick={() => this.props.finalCallback({ passphrase: words.join(' ') })}
            />
          </div>
        </section>
      </section>
    );
  }
}

export default Confirm;
