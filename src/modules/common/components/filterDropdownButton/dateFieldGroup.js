import { withTranslation } from 'react-i18next';
import React from 'react';
import moment from 'moment';
import { firstBlockTime } from '@block/utils/firstBlockTime';
import { getDateTimestampFromFirstBlock, formatInputToDate } from 'src/utils/dateTime';
import Feedback from 'src/theme/feedback/feedback';
import DateField from './dateField';
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
          feedback: '',
        },
        dateFrom: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
      },
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

  getFeedbackMessage(fieldsObj, value) {
    const { t } = this.props;
    const date = moment(value, this.dateFormat);
    let feedback = '';

    if (value && !date.isValid()) {
      feedback = t(`Date must be in ${this.dateFormat} format`);
    } else if (
      moment(fieldsObj.dateFrom.value, this.dateFormat) >
      moment(fieldsObj.dateTo.value, this.dateFormat)
    ) {
      feedback = t('Invalid dates');
    } else if (date.isValid() && getDateTimestampFromFirstBlock(value, this.dateFormat) < 0) {
      feedback = t('Date must be after {{firstBlock}}', {
        firstBlock: moment(firstBlockTime).format(this.dateFormat),
      });
    }
    return feedback;
  }

  validateDates(fieldsObj) {
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      const feedback = this.getFeedbackMessage(fieldsObj, value);

      return {
        ...acc,
        [field]: {
          value,
          error: !!feedback,
          feedback,
          loading: false,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields });
  }

  handleFieldChange({ target }) {
    const { filters } = this.props;

    const value = formatInputToDate(target.value, '.');

    const fieldsObj = Object.keys(filters).reduce(
      (acc, filter) => ({ ...acc, [filter]: { value: filters[filter] } }),
      {}
    );

    const fields = {
      ...fieldsObj,
      [target.name]: { value, loading: true },
    };

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateDates(fields);
    }, 300);

    this.setState({ fields });
    this.props.updateCustomFilters(fields);
  }

  render() {
    const { label, filters, showRightDropdown } = this.props;
    const { fields } = this.state;
    const dateFieldProps = {
      dateFormat: this.dateFormat,
      filters,
      onChange: this.handleFieldChange,
      fields,
      setInputRefs: this.setInputRefs,
    };

    const feedback = Object.values(fields).reduce((acc, f) => acc || f.feedback, '');

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={styles.fieldRow}>
          <DateField
            showRightDropdown={showRightDropdown}
            name="dateFrom"
            data-testid="dateFrom"
            {...dateFieldProps}
          />
          <span className={styles.separator} />
          <DateField
            showRightDropdown={showRightDropdown}
            data-testid="dateTo"
            name="dateTo"
            {...dateFieldProps}
          />
        </div>
        <Feedback status="error" size="xs" message={feedback} />
      </div>
    );
  }
}

export default withTranslation()(DateFieldGroup);
