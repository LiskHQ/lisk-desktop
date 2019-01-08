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
import avatar from '../../assets/images/icons-v2/avatar.svg';

const Options = ({
  optionIndex, options, answers, handleSelect, enabled = null,
}) => (
  <div className={`${styles.optionsHolder}`}>
    <span className={`${styles.blank} ${answers[optionIndex] && styles.filled}`}>
      { answers[optionIndex] }
    </span>
    {options.map((option, optionKey) =>
      <span className={`${styles.option}`} key={optionKey}>
        <PrimaryButtonV2
          onClick={() => handleSelect(option, optionIndex)}
          disabled={!enabled}>
          { option }
        </PrimaryButtonV2>
      </span>)}
  </div>
);

class ConfirmPassphrase extends React.Component {
  constructor() {
    super();
    this.state = {
      numberOfOptions: 3,
      words: [2, 9],
      tries: 0,
      answers: [],
      options: [],
    };
  }

  componentWillMount() {
    const options = this.assembleWordOptions(this.props.passphrase, this.state.words);
    this.setState({
      options,
    });
  }

  getRandomWordsFromPassphrase(passphrase, qty) {
    let indexes = passphrase.split(/\s/).map((w, index) => index);
    const words = [...Array(qty)].map(() => {
      const index = Math.floor(Math.random() * indexes.length);
      indexes = [...indexes.slice(0, index), ...indexes.slice(index + 1)];
      return index;
    }).sort((a, b) => a - b);

    this.setState({
      words,
    });
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
    const { words, options } = this.state;
    let optionIndex = 0;

    return (
      <React.Fragment>
        <div className={`${registerStyles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            <img src={avatar} />
            {t('Confirm your passphrase')}
          </h1>
          <p>{t('Choose the rights word missing from your Passphrase.')}</p>
          <p>{t('It was given in a previous step')}</p>
        </div>

        <div className={`${styles.confirmHolder}`}>
          {passphrase.split(/\s/).map((word, key) =>
            <div className={styles.word} key={key}>
              { !words.includes(key)
                ? word
                : <Options
                  options={options[optionIndex]}
                  answers={this.state.answers}
                  handleSelect={this.handleSelect.bind(this)}
                  enabled={optionIndex === 0 || this.state.answers[optionIndex - 1]}
                  optionIndex={optionIndex++} />
              }
            </div>)
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
            <PrimaryButtonV2>
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
