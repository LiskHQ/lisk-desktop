import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import styles from './confirm.css';
import { PrimaryButton } from '../../toolbox/buttons/button';
import { extractAddress } from '../../../utils/api/account';
import TransitionWrapper from '../../toolbox/transitionWrapper';
import AccountVisual from '../../accountVisual';
import SecondPassphraseSteps from '../ConfirmSecond';

class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedFieldset: -1,
      step: 'verify',
      numberOfOptions: 3,
      words: [],
      missing: [],
      answers: new Array(2),
      trials: 0,
      showError: false,
      formStatus: styles.clean,
    };
  }

  componentDidMount() {
    // this.props.randomIndex is used in unit teasing
    this.resetForm.call(this);
    this.address = this.getAddress();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  updateState(answers) {
    switch (this.formStatus(answers)) {
      case 'valid':
        this.setState({
          formStatus: styles.valid,
          answers,
        });
        this.next();
        break;
      case 'invalid':
        this.setState({ formStatus: styles.invalid, answers });
        this.timeout = setTimeout(() => {
          this.resetForm.call(this);
        }, 800);
        break;
      case 'out of trials':
        this.setState({ formStatus: styles.outOfTrials, answers });
        break;
      default:
        this.setState({ answers });
    }
  }

  onWordSelected(e) {
    const index = e.nativeEvent.target.getAttribute('answer');
    const answers = [...this.state.answers];
    answers[index] = {
      value: e.nativeEvent.target.value,
      validity: e.nativeEvent.target.value === this.state.words[this.state.missing[index]],
    };

    this.updateState(answers);
  }

  // eslint-disable-next-line class-methods-use-this
  formStatus(answers) {
    // eslint-disable-next-line eqeqeq
    if (!answers.reduce((acc, current) => (acc && current != undefined), true)) {
      return 'not filled';
    }
    if (answers.reduce((acc, current) => (acc && current && current.validity), true)) {
      return 'valid';
    }
    if (this.state.trials < 3) {
      return 'invalid';
    }
    return 'out of trials';
  }

  next() {
    setTimeout(() => {
      this.setState({ step: 'done' });
    }, 800);
  }

  resetForm() {
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

    const missing = chooseRandomWords(2).sort((a, b) => a - b);
    const wordOptions = this.assembleWordOptions(words, missing);

    this.setState({
      words,
      missing,
      selectedFieldset: -1,
      wordOptions,
      formStatus: styles.clean,
      answers: new Array(2),
      trials: this.state.trials + 1,
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
        const rand = Math.floor(Math.random() * 0.99 * list.length);
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

  selectFieldset(index) {
    this.setState({ selectedFieldset: index });
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
    const { missing, words, wordOptions, step, answers, selectedFieldset, trials } = this.state;
    const errorTitleVisibility = (this.state.formStatus === styles.outOfTrials ||
      this.state.formStatus === styles.invalid) ? styles.visible : '';

    return (
      <section className={`passphrase-verifier ${styles.verifier} ${styles[step]}`}>
        <header className={styles.table}>
          <div className={styles.tableCell}>
            <TransitionWrapper current={this.state.step} step='verify'>
              <h2 className={styles.verify}>{this.props.t('Choose the correct phrases to confirm.')}</h2>
            </TransitionWrapper>
            {!this.props.secondPassConfirmation ? <TransitionWrapper current={this.state.step} step='done'>
              <h2 className={styles.done}>{this.props.t('Perfect! You’re all set.')}</h2>
            </TransitionWrapper> : null}
            <h5 className={`${styles.verify} ${errorTitleVisibility}`}>
              {this.props.t('Please go back and check your passphrase again.')}
            </h5>
          </div>
        </header>
        <section className={`${styles.table} ${styles.verify}`}>
          <div className={styles.tableCell}>
            <form className={`passphrase-holder ${this.state.formStatus}`}>
              {
                wordOptions ?
                  words.map((word, index) => {
                    if (!missing.includes(index)) {
                      return (<span key={word} className={styles.word}>{word}</span>);
                    }
                    missingWordIndex++;
                    const validity = answers[missingWordIndex] && answers[missingWordIndex].validity ? 'valid' : 'invalid';

                    return (
                      <fieldset key={`${word}-${missingWordIndex}-${trials}`}>
                        <span onClick={this.selectFieldset.bind(this, missingWordIndex)}
                          className={`${styles.placeholder} ${selectedFieldset === missingWordIndex ?
                            styles.selected : ''} ${answers[missingWordIndex] ? styles[validity] : ''}`}>{answers[missingWordIndex] ? answers[missingWordIndex].value : ''}</span>
                        {
                          wordOptions[missingWordIndex].map(wd =>
                            <div key={`${wd}-${missingWordIndex}-${trials}`}>
                              <input
                                name={`answer${missingWordIndex}`}
                                className={styles.option}
                                answer={missingWordIndex}
                                type='radio'
                                value={wd}
                                id={`${wd}-${missingWordIndex}-${trials}`}
                                onChange={this.onWordSelected.bind(this)} />
                              <label className={styles.option} htmlFor={`${wd}-${missingWordIndex}-${trials}`}>{wd}</label>
                            </div>)
                        }
                      </fieldset>
                    );
                  }) : null
              }
            </form>
          </div>
        </section>
        {
          this.props.secondPassConfirmation ?
            <SecondPassphraseSteps
              hidden={this.state.step !== 'done'}
              finalCallback={(passphrase) => { this.props.finalCallback(words.join(' '), passphrase); }}/> :
            <section className={`${styles.table} ${styles.done}`}>
              <div className={styles.tableCell}>
                <figure>
                  <AccountVisual address={this.getAddress()} size={200} />
                </figure>
                <h4 className={styles.address}>{this.address}</h4>
                <PrimaryButton
                  theme={styles}
                  disabled={this.state.step !== 'done'}
                  label={this.props.t('Get to your Dashboard')}
                  className={`${styles.button} get-to-your-dashboard-button`}
                  onClick={() => this.props.finalCallback(words.join(' '))}
                />
              </div>
            </section>
        }
      </section>
    );
  }
}

export default Confirm;
