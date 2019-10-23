import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import registerStyles from './register.css';
import styles from './confirmPassphrase.css';
import PassphraseRenderer from '../../shared/passphraseRenderer';

class ConfirmPassphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      words: [2, 9],
      answers: [],
      options: [],
      hasErrors: false,
      isCorrect: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.verifyChoices = this.verifyChoices.bind(this);
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    const options = this.assembleWordOptions(this.props.passphrase, this.state.words);
    this.setState({ options });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getRandomIndexesFromPassphrase(passphrase, qty) {
    let indexes = passphrase.split(/\s/).map((w, index) => index);
    const words = [...Array(qty)].map(() => {
      const index = indexes[Math.floor(Math.random() * indexes.length)];
      indexes = [...indexes.slice(0, index), ...indexes.slice(index + 1)];
      return index;
    }).sort((a, b) => a - b);

    const options = this.assembleWordOptions(this.props.passphrase, words);
    this.setState({
      options,
      words,
      answers: [],
      hasErrors: false,
    });
  }

  verifyChoices() {
    const { answers } = this.state;
    const passphrase = this.props.passphrase.split(/\s/);
    const corrects = answers.filter((answer, index) => answer === passphrase[index]);
    return corrects.length === 2;
  }

  handleConfirm(status) {
    const numberOfWords = 2;
    const state = {
      isCorrect: status,
      hasErrors: !status,
    };
    const cb = status
      ? () => this.props.nextStep({ passphrase: this.props.passphrase })
      : () => !state.outOfTries
        && this.getRandomIndexesFromPassphrase(this.props.passphrase, numberOfWords);
    this.setState(state);
    this.timeout = setTimeout(cb, 1500);
  }

  enableConfirmButton() {
    const {
      answers, words, hasErrors, isCorrect,
    } = this.state;
    return answers.filter(answer => !!answer).length === words.length && !hasErrors && !isCorrect;
  }

  // eslint-disable-next-line class-methods-use-this
  assembleWordOptions(passphrase, missing) {
    const words = passphrase.split(/\s/);
    const wordsList = fillWordsList.filter(word => !passphrase.includes(word));
    const numberOfOptions = 3;

    const mixWithMissingWords = options =>
      options.map((list, listIndex) => {
        const rand = Math.floor(Math.random() * 0.99 * list.length);
        list[rand] = words[missing[listIndex]];
        return list;
      });

    const wordOptions = [...Array(missing.length)].map(() =>
      [...Array(numberOfOptions)].map(() =>
        wordsList[Math.floor(Math.random() * wordsList.length)]));

    return mixWithMissingWords(wordOptions);
  }

  handleSelect(answer, index) {
    const { answers } = this.state;
    answers[index] = answer;
    this.setState({
      answers,
    });
  }

  render() {
    const { t, passphrase, prevStep } = this.props;
    const {
      words, options, hasErrors, answers, isCorrect, outOfTries,
    } = this.state;

    return (
      <React.Fragment>
        <span className={`${registerStyles.stepsLabel}`}>
          {t('Step {{current}} / {{total}}', { current: 3, total: 4 })}
        </span>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            {t('Confirm your passphrase')}
          </h1>
          <p className={styles.text}>{t('Keep it safe as it is the only way to access your wallet.')}</p>
        </div>

        <div className={`${grid['col-sm-10']} ${styles.passphraseContainer}`}>
          <PassphraseRenderer
            showInfo
            handleSelect={this.handleSelect}
            missingWords={words}
            options={{
              [words[0]]: options[0],
              [words[1]]: options[1],
            }}
            hasErrors={hasErrors}
            answers={answers}
            isCorrect={isCorrect}
            values={passphrase.split(' ')}
            isConfirmation
          />
        </div>

        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <span className={`${registerStyles.button}`}>
            <TertiaryButton
              className={registerStyles.backButton}
              onClick={prevStep}
            >
              {t('Go back')}
            </TertiaryButton>
          </span>
          <span className={`${registerStyles.button}`}>
            <PrimaryButton
              className={`${registerStyles.continueBtn} passphrase-is-correct-button`}
              onClick={() => this.handleConfirm(this.verifyChoices())}
              disabled={!this.enableConfirmButton()}
            >
              {t('Confirm')}
            </PrimaryButton>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default withTranslation()(ConfirmPassphrase);
