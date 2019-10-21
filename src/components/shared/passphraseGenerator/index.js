import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
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

  getStyle(i) {
    const { missingWords, isConfirmation } = this.props;
    const { fieldSelected, chosenWords } = this.state;

    if (!missingWords) return styles.default;
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
    return this.state.chosenWords[i] || '_________';
  }

  render() {
    const {
      values, options, missingWords,
    } = this.props;

    const { fieldSelected } = this.state;

    return (
      <div>
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
        {fieldSelected && (
          <div className={styles.optionsContainer}>
            {options[fieldSelected].map((option, i) => (
              <div
                onClick={() => this.setState({
                  ...this.state,
                  chosenWords: {
                    ...this.state.chosenWords,
                    [fieldSelected]: option,
                  },
                })}
                key={i}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default PassphraseGenerator;
