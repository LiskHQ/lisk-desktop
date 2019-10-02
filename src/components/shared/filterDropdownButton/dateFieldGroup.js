import { withTranslation } from 'react-i18next';
import React from 'react';
import moment from 'moment';
import { firstBlockTime } from '../../../constants/datetime';
import { getDateTimestampFromFirstBlock, formatInputToDate } from '../../../utils/datetime';
import { getInputSelection, setInputSelection } from '../../../utils/selection';
import DateField from './dateField';
import Feedback from '../../toolbox/feedback/feedback';
import styles from './filters.css';

class DateFieldGroup extends React.Component {
  constructor(props) {
    super();

    this.state = {
      fields: {
        dateTo: {
          error: false,
          value: '',
          loading: false,
        },
        dateFrom: {
          error: false,
          value: '',
          loading: false,
        },
      },
      feedback: '',
    };

    this.inputRefs = {
      dateTo: null,
      dateFrom: null,
    };

    this.timeout = null;

    this.dateFormat = props.t('DD.MM.YY');

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.setInputRefs = this.setInputRefs.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  setInputRefs(node) {
    if (node && node.name) {
      this.inputRefs[node.name] = node;
    }
  }

  validateDates(fieldsObj, selectionObj) {
    const { t } = this.props;
    let feedback = '';
    // eslint-disable-next-line max-statements
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      const date = moment(value, this.dateFormat);
      let error = false;

      if (value && !date.isValid()) {
        feedback = t(`Date must be in ${this.dateFormat} format`);
        error = true;
      } else if (
        (field === 'dateFrom' && date > moment(fieldsObj.dateTo.value, this.dateFormat))
        || (field === 'dateTo' && date < moment(fieldsObj.dateFrom.value, this.dateFormat))
      ) {
        feedback = t('Invalid dates');
        error = true;
      }

      if (date.isValid() && getDateTimestampFromFirstBlock(value, this.dateFormat) < 0) {
        feedback = t('Date must be after {{firstBlock}}', {
          firstBlock: moment(firstBlockTime).format(this.dateFormat),
        });
        error = true;
      }

      return {
        ...acc,
        [field]: {
          value,
          error,
          loading: false,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields, feedback }, () => {
      setInputSelection(this.inputRefs[selectionObj.name], selectionObj.start, selectionObj.end);
    });
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { filters } = this.props;
    const selection = getInputSelection(this.inputRefs[target.name]);

    const value = formatInputToDate(target.value, '.');
    if (target.value.length < value.length) {
      selection.start += 1;
      selection.end += 1;
    }

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    const selectionObj = {
      name: target.name,
      ...selection,
    };

    const fields = {
      ...fieldsObj,
      [target.name]: { value, loading: true },
    };

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateDates(fields, selectionObj);
    }, 300);

    this.setState({ fields });
    this.props.updateCustomFilters(fields);
  }

  render() {
    const { label, filters } = this.props;
    const { fields } = this.state;
    const dateFieldProps = {
      dateFormat: this.dateFormat,
      filters,
      onChange: this.handleFieldChange,
      fields,
      setInputRefs: this.setInputRefs,
    };

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={styles.fieldRow}>
          <DateField name="dateFrom" {...dateFieldProps} />
          <span className={styles.separator} />
          <DateField name="dateTo" {...dateFieldProps} />
        </div>
        <Feedback
          className={styles.feedback}
          show={!!this.state.feedback}
          status={this.state.feedback ? 'error' : ''}
          size="xs"
        >
          { this.state.feedback }
        </Feedback>
      </div>
    );
  }
}

export default withTranslation()(DateFieldGroup);
