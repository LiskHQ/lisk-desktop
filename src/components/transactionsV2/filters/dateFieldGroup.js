import React from 'react';
import moment from 'moment';
import { translate } from 'react-i18next';
import { getDateTimestampFromFirstBlock, formatInputToDate } from '../../../utils/datetime';
import { InputV2 } from '../../toolbox/inputsV2';
import { getInputSelection, setInputSelection } from '../../../utils/selection';
import styles from './filters.css';

class DateFieldGroup extends React.Component {
  constructor(props) {
    super();

    this.state = {
      fields: {
        dateTo: {
          error: false,
          value: '',
        },
        dateFrom: {
          error: false,
          value: '',
        },
      },
      feedback: '',
    };

    this.inputRefs = {
      dateTo: null,
      dateFrom: null,
    };

    this.dateFormat = props.t('DD.MM.YY');

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.setRefs = this.setRefs.bind(this);
  }

  setRefs(node) {
    this.inputRefs[node.name] = node;
  }

  validateDates(fieldsObj, selectionObj) {
    const { t } = this.props;
    let feedback = '';
    // eslint-disable-next-line max-statements
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      const date = moment(value, this.dateFormat);
      let error = false;

      if (value !== '' && !date.isValid()) {
        feedback = t(`Date must be in ${this.dateFormat} format`);
        error = true;
      } else if (
        (field === 'dateFrom' && date > moment(fieldsObj.dateTo.value, this.dateFormat))
        || (field === 'dateTo' && date < moment(fieldsObj.dateFrom.value, this.dateFormat))
      ) {
        feedback = t('Invalid Dates');
        error = true;
      }

      if (date.isValid() && getDateTimestampFromFirstBlock(value, this.dateFormat) < 0) {
        feedback = t('Date must be after {{firstBlock}}', {
          firstBlock: moment(new Date(2016, 4, 24, 17)).format(this.dateFormat),
        });
        error = true;
      }

      return {
        ...acc,
        [field]: {
          ...fieldsObj[field],
          value,
          error,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields, feedback }, () => {
      setInputSelection(this.inputRefs[selectionObj.name], selectionObj.start, selectionObj.end);
    });
  }

  handleFieldChange({ target }) {
    const { filters } = this.props;
    const value = formatInputToDate(target.value, '.');

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    const selectionObj = {
      name: target.name,
      ...getInputSelection(this.inputRefs[target.name]),
    };

    this.validateDates({
      ...fieldsObj,
      [target.name]: { value },
    }, selectionObj);
  }

  render() {
    const { filters, handleKeyPress, t } = this.props;
    const { fields } = this.state;

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{t('Date')}</span>
        <div className={styles.fieldRow}>
          <InputV2
            setRef={this.setRefs}
            autoComplete={'off'}
            onChange={this.handleFieldChange}
            name='dateFrom'
            value={filters.dateFrom}
            placeholder={this.dateFormat}
            onFocus={this.handleFocus}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.dateFrom.error ? 'error' : ''} dateFromInput`} />
          <span>-</span>
          <InputV2
            setRef={this.setRefs}
            autoComplete={'off'}
            onChange={this.handleFieldChange}
            name='dateTo'
            value={filters.dateTo}
            placeholder={this.dateFormat}
            onFocus={this.handleFocus}
            onKeyDown={handleKeyPress}
            className={`${styles.input} ${fields.dateTo.error ? 'error' : ''} dateToInput`} />
        </div>
        <span className={`${styles.feedback} ${this.state.feedback ? styles.show : ''}`}>
          {this.state.feedback}
        </span>
      </div>
    );
  }
}

export default translate()(DateFieldGroup);
