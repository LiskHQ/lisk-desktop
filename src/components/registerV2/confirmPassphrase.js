import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import registerStyles from './registerV2.css';
import styles from './confirmPassphrase.css';
import lock from '../../assets/images/icons-v2/lock.svg';
import Options from './confirmPassphraseOptions';

class ConfirmPassphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      numberOfOptions: 3,
      numberOfWords: 2,
      words: [2, 9],
      tries: 0,
      answers: [],
      options: [],
      hasErrors: false,
      isCorrect: false,
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    const options = this.assembleWordOptions(this.props.passphrase, this.state.words);
    this.setState({
      options,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getRandomWordsFromPassphrase(passphrase, qty) {
    let indexes = passphrase.split(/\s/).map((w, index) => index);
    const words = [...Array(qty)].map(() => {
      const index = Math.floor(Math.random() * indexes.length);
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

  handleConfirm() {
    const { answers, words } = this.state;
    const passphrase = this.props.passphrase.split(/\s/);
    const corrects = answers.filter((answer, index) => answer === passphrase[words[index]]);
    clearTimeout(this.timeout);
    if (corrects.length === answers.length) {
      this.setState({ isCorrect: true });
      this.timeout = setTimeout(() =>
        this.props.next(), 1500);
    } else {
      const tries = this.state.tries + 1;
      this.setState({
        tries,
        hasErrors: true,
      });
      this.timeout = setTimeout(() =>
        this.getRandomWordsFromPassphrase(this.props.passphrase, this.state.numberOfWords), 1500);
    }
  }

  enableConfirmButton() {
    const {
      answers, words, hasErrors, isCorrect,
    } = this.state;
    return answers.filter(answer => !!answer).length === words.length && !hasErrors && !isCorrect;
  }

  assembleWordOptions(passphrase, missing) {
    const words = passphrase.split(/\s/);
    const wordsList = fillWordsList.filter(word => !passphrase.includes(word));

    const mixWithMissingWords = options =>
      options.map((list, listIndex) => {
        const rand = Math.floor(Math.random() * 0.99 * list.length);
        list[rand] = words[missing[listIndex]];
        return list;
      });

    const wordOptions = [...Array(missing.length)].map(() =>
      [...Array(this.state.numberOfOptions)].map(() =>
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
    const { t, passphrase } = this.props;
    const {
      words, options, hasErrors, answers, isCorrect,
    } = this.state;
    let optionIndex = 0;

    return (
      <React.Fragment>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            <img src={lock} />
            {t('Confirm your passphrase')}
          </h1>
          <p>{t('Choose the rights word missing from your Passphrase.')}</p>
          <p>{t('It was given in a previous step')}</p>
          <p>{this.state.tries}</p>
        </div>

        <div className={`${styles.confirmHolder}`}>
          {passphrase.split(/\s/).map((word, key) =>
            <span className={styles.word} key={key}>
              { !words.includes(key)
                ? word
                : <Options
                  isCorrect={isCorrect}
                  hasErrors={hasErrors}
                  options={options[optionIndex]}
                  answers={answers}
                  handleSelect={this.handleSelect}
                  enabled={optionIndex === 0 || answers[optionIndex - 1]}
                  optionIndex={optionIndex++} />
              }
            </span>)
          }
        </div>


        <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
          <Link className={`${registerStyles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
            <SecondaryButtonV2>
              <FontIcon className={registerStyles.icon}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </Link>
          <span className={`${registerStyles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2
              onClick={this.handleConfirm.bind(this)}
              disabled={!this.enableConfirmButton()}>
              {t('Confirm')}
              <FontIcon className={registerStyles.icon}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default translate()(ConfirmPassphrase);
