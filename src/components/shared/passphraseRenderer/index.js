import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import styles from './passphraseRenderer.css';

class PassphraseRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldSelected: undefined,
      displayOptions: undefined,
      chosenWords: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hasErrors && !this.props.hasErrors) {
      this.setState({
        fieldSelected: undefined,
        displayOptions: undefined,
        chosenWords: {},
      });
    }
  }

  getStyle(i) {
    const {
      missingWords, isConfirmation,
    } = this.props;
    const { chosenWords } = this.state;

    if (!missingWords) return styles.default;
    if (chosenWords[i]) return this.getChosenWordsStyle(i);
    if (missingWords.includes(i)) return this.getMissingWordsStyle(i);
    if (isConfirmation) return styles.disabled;
    return styles.default;
  }

  getChosenWordsStyle() {
    const { hasErrors, isCorrect } = this.props;
    if (hasErrors) return styles.error;
    if (isCorrect) return styles.correct;
    return styles.selected;
  }

  getMissingWordsStyle(i) {
    const { fieldSelected } = this.state;
    if (fieldSelected === i) return styles.emptyInputFocused;
    return styles.emptyInput;
  }

  handleClick(index) {
    this.setState({ fieldSelected: index, displayOptions: true });
  }

  renderMissingValue(i) {
    return this.state.chosenWords[i] || '_______';
  }

  chooseWord(index, option) {
    this.setState({
      ...this.state,
      chosenWords: {
        ...this.state.chosenWords,
        [index]: option,
      },
    });
    this.props.handleSelect(option, index);
  }

  render() {
    const {
      values, options, missingWords, t, showInfo,
    } = this.props;

    const { fieldSelected, chosenWords } = this.state;

    return (
      <div>
        {showInfo && (
          <React.Fragment>
            <h2 className={styles.header}>{t('Passphrase')}</h2>
            <p className={styles.subheader}>{t('Please carefully write down these 12 words and store them in a safe place.')}</p>
          </React.Fragment>
        )}
        <div className={styles.passphraseContainer}>
          <div className={`${styles.inputsRow} ${grid.row} passphrase`}>
            {values.map((value, i) => (
              <div onClick={() => this.handleClick(i)} className={`${grid['col-xs-2']} ${styles.inputContainer}`} key={i}>
                <span className={`${styles.inputValue} ${this.getStyle(i)}`}>{missingWords && missingWords.includes(i) ? this.renderMissingValue(i) : value}</span>
                <span className={styles.whitespace}>&nbsp;</span>
              </div>
            ))}
          </div>
        </div>
        {fieldSelected && Object.keys(chosenWords).length < 2 && (
          <div className={styles.optionsContainer}>
            {options[fieldSelected].map((option, i) => (
              <div className="option" onClick={() => this.chooseWord(fieldSelected, option)} key={i}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(PassphraseRenderer);
