import React from 'react';
import fillWordsList from 'bitcore-mnemonic/lib/words/english';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import styles from './passphraseRenderer.css';

class PassphraseRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.values = props.passphrase.split(' ');
    const initialIndexes = [2, 9];

    this.state = {
      indexes: initialIndexes,
      fieldSelected: initialIndexes[0],
      chosenWords: {},
      options: this.assembleWordOptions(this.values, initialIndexes),
      isCorrect: false,
      hasErrors: false,
    };

    this.handleConfirm = this.handleConfirm.bind(this);
    this.setRandomIndexesFromPassphrase = this.setRandomIndexesFromPassphrase.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleConfirm() {
    const { chosenWords, indexes } = this.state;

    const answers = Object.values(chosenWords);
    const isCorrect =
      answers.filter((answer, index) => answer === this.values[indexes[index]]).length === 2;

    const cb = isCorrect ? this.props.nextStep : this.setRandomIndexesFromPassphrase;

    this.setState({
      isCorrect,
      hasErrors: !isCorrect,
    });

    this.timeout = setTimeout(cb, 1500);
  }

  setRandomIndexesFromPassphrase() {
    const numberOfMissingWords = 2;
    let idxs = this.values.map((w, index) => index);
    const indexes = [...Array(numberOfMissingWords)]
      .map(() => {
        const index = idxs[Math.floor(Math.random() * idxs.length)];
        idxs = [...idxs.slice(0, index), ...idxs.slice(index + 1)];
        return index;
      })
      .sort((a, b) => a - b);

    this.setState({
      options: this.assembleWordOptions(this.values, indexes),
      indexes,
      answers: [],
      hasErrors: false,
      chosenWords: {},
      fieldSelected: indexes[0],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  assembleWordOptions(values, missing) {
    const wordsList = fillWordsList.filter((word) => !values.includes(word));
    const numberOfOptions = 3;

    const mixWithMissingWords = (options) =>
      options.reduce((accumulator, item, listIndex) => {
        const rand = Math.floor(Math.random() * 0.99 * item.length);
        item[rand] = values[missing[listIndex]];
        accumulator[missing[listIndex]] = item;
        return accumulator;
      }, {});

    const wordOptions = [...Array(missing.length)].map(() =>
      [...Array(numberOfOptions)].map(() => wordsList[Math.floor(Math.random() * wordsList.length)])
    );

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
    const otherIndex = indexes.find((index) => index !== selectedIndex);
    const shouldDisplayOptions = Object.values(chosenWords).length < 2;

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
    const { t, showInfo, isConfirmation, prevStep, footerStyle } = this.props;
    const { options, fieldSelected, chosenWords } = this.state;
    const missingWordsIndexes = isConfirmation && Object.keys(options).map((k) => Number(k));

    return (
      <div>
        {showInfo && (
          <>
            <h2 className={styles.header}>{t('Passphrase')}</h2>
            <p className={styles.subheader}>
              {t('Please carefully write down these 12 words and store them in a safe place.')}
            </p>
          </>
        )}
        <div className={styles.passphraseContainer}>
          <div className={`${styles.inputsRow} ${grid.row} passphrase`}>
            {this.values.map((value, i) => (
              <div
                onClick={() => this.handleClick(i)}
                className={`${grid['col-xs-2']} ${styles.inputContainer}`}
                key={i}
              >
                <span
                  className={`${styles.inputValue} ${this.getStyle(i, missingWordsIndexes)} word`}
                >
                  {isConfirmation && missingWordsIndexes.includes(i)
                    ? this.renderMissingValue(i)
                    : value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className={[styles.optionsContainer, 'word-options'].join(' ')}>
          {isConfirmation &&
            typeof fieldSelected === 'number' &&
            options[fieldSelected].map((option, i) => (
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
            <TertiaryButton className={styles.editBtn} onClick={prevStep}>
              {t('Go back')}
            </TertiaryButton>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(PassphraseRenderer);
