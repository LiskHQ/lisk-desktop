import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import styles from './passphraseRenderer.css';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';

class PassphraseRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexes: [2, 9],
      fieldSelected: undefined,
      chosenWords: {},
      options: {},
      isCorrect: false,
      hasErrors: false,
      values: [],
    };

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  componentDidMount() {
    const { indexes } = this.state;
    const values = this.props.passphrase.split(' ');

    const options = this.assembleWordOptions(values, indexes);
    this.setState({
      ...this.state,
      options: {
        [indexes[0]]: options[0],
        [indexes[1]]: options[1],
      },
      values,
      fieldSelected: indexes[0],
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleConfirm() {
    const { chosenWords, indexes } = this.state;
    const { values } = this.state;

    const answers = Object.values(chosenWords);
    const isCorrect = answers.filter((answer, index) => answer === values[indexes[index]])
      .length === 2;

    const cb = isCorrect
      ? () => this.props.nextStep()
      : () => this.setRandomIndexesFromPassphrase(2);

    this.setState({
      isCorrect,
      hasErrors: !isCorrect,
    });

    this.timeout = setTimeout(cb, 1500);
  }

  setRandomIndexesFromPassphrase(qty) {
    const { values } = this.state;
    let idxs = values.map((w, index) => index);
    const indexes = [...Array(qty)]
      .map(() => {
        const index = idxs[Math.floor(Math.random() * idxs.length)];
        idxs = [...idxs.slice(0, index), ...idxs.slice(index + 1)];
        return index;
      })
      .sort((a, b) => a - b);
    const options = this.assembleWordOptions(values, indexes);

    this.setState({
      options: {
        [indexes[0]]: options[0],
        [indexes[1]]: options[1],
      },
      indexes,
      answers: [],
      hasErrors: false,
      chosenWords: {},
      fieldSelected: indexes[0],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  assembleWordOptions(values, missing) {
    const wordsList = fillWordsList.filter(word => !values.includes(word));
    const numberOfOptions = 3;

    const mixWithMissingWords = options =>
      options.map((list, listIndex) => {
        const rand = Math.floor(Math.random() * 0.99 * list.length);
        list[rand] = values[missing[listIndex]];
        return list;
      });

    const wordOptions = [...Array(missing.length)].map(() =>
      [...Array(numberOfOptions)].map(
        () => wordsList[Math.floor(Math.random() * wordsList.length)],
      ));

    return mixWithMissingWords(wordOptions);
  }

  getStyle(i, missingWords) {
    const { isConfirmation } = this.props;
    const { chosenWords } = this.state;

    if (!missingWords) return styles.default;
    if (chosenWords[i]) return this.getChosenWordsStyle(i);
    if (missingWords.includes(i)) return this.getMissingWordsStyle(i);
    if (isConfirmation) return styles.disabled;
    return styles.default;
  }

  getChosenWordsStyle() {
    const { hasErrors, isCorrect } = this.state;
    if (hasErrors) return styles.error;
    if (isCorrect) return styles.correct;
    return styles.selected;
  }

  getMissingWordsStyle(i) {
    const { fieldSelected } = this.state;
    if (fieldSelected === i) return styles.emptyWordFocused;
    return styles.emptyWord;
  }

  handleClick(index) {
    this.setState({ fieldSelected: index });
  }

  renderMissingValue(i) {
    return this.state.chosenWords[i] || '_______';
  }

  chooseWord(selectedIndex, option) {
    const { chosenWords, indexes } = this.state;
    const otherIndex = indexes.find(index => index !== selectedIndex);
    const shouldDisplayOptions = Object.values(chosenWords) < 2;

    this.setState({
      ...this.state,
      chosenWords: {
        ...chosenWords,
        [selectedIndex]: option,
      },
      fieldSelected: shouldDisplayOptions ? otherIndex : undefined,
    });
  }

  render() {
    const {
      t, showInfo, isConfirmation, prevStep, footerStyle,
    } = this.props;
    const {
      options, fieldSelected, chosenWords, values,
    } = this.state;
    const missingWordsIndexes = isConfirmation && Object.keys(options).map(k => Number(k));

    return (
      <div>
        {showInfo && (
          <React.Fragment>
            <h2 className={styles.header}>{t('Passphrase')}</h2>
            <p className={styles.subheader}>
              {t('Please carefully write down these 12 words and store them in a safe place.')}
            </p>
          </React.Fragment>
        )}
        <div className={styles.passphraseContainer}>
          <div className={`${styles.inputsRow} ${grid.row} passphrase`}>
            {values.map((value, i) => (
              <div
                onClick={() => this.handleClick(i)}
                className={`${grid['col-xs-2']} ${styles.inputContainer}`}
                key={i}
              >
                <span className={`${styles.inputValue} ${this.getStyle(i, missingWordsIndexes)} word`}>
                  {isConfirmation && missingWordsIndexes.includes(i)
                    ? this.renderMissingValue(i)
                    : value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={[styles.optionsContainer, 'word-options'].join(' ')}>
          {isConfirmation && typeof fieldSelected === 'number' && options[fieldSelected].map((option, i) => (
            <div
              className="option"
              onClick={() => this.chooseWord(fieldSelected, option)}
              key={i}
            >
              {option}
            </div>
          ))}
        </div>
        {isConfirmation && (
        <div className={`${styles.confirmPassphraseFooter} ${footerStyle}`}>
          <PrimaryButton
            className={[styles.confirmBtn, 'confirm'].join(' ')}
            onClick={this.handleConfirm}
            disabled={Object.keys(chosenWords).length < 2}
          >
            {t('Confirm')}
          </PrimaryButton>
          <TertiaryButton
            className={styles.editBtn}
            onClick={prevStep}
          >
            {t('Go back')}
          </TertiaryButton>
        </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(PassphraseRenderer);
