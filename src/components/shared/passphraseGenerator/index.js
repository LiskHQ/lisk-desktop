import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { withTranslation } from 'react-i18next';
import styles from './passphraseGenerator.css';

class PassphraseGenerator extends React.Component {
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

  // eslint-disable-next-line complexity
  getStyle(i) {
    const {
      missingWords, isConfirmation, hasErrors, isCorrect,
    } = this.props;
    const { fieldSelected, chosenWords } = this.state;

    if (!missingWords) return styles.default;
    if (chosenWords[i] && hasErrors) return styles.error;
    if (chosenWords[i] && isCorrect) return styles.correct;
    if (chosenWords[i]) return styles.selected;
    if (missingWords.includes(i) && fieldSelected === i) return styles.emptyInputFocused;
    if (missingWords.includes(i) && fieldSelected !== i) return styles.emptyInput;
    if (isConfirmation) return styles.disabled;
    return styles.default;
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

export default withTranslation()(PassphraseGenerator);
