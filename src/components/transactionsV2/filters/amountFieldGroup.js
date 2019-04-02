import React from 'react';
import { translate } from 'react-i18next';
import { InputV2 } from '../../toolbox/inputsV2';
import Feedback from '../../toolbox/feedback/feedback';
import SpinnerV2 from '../../spinnerV2/spinnerV2';
import svg from '../../../utils/svgIcons';
import styles from './filters.css';

class AmountFieldGroup extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        amountTo: {
          error: false,
          value: '',
          loading: false,
        },
        amountFrom: {
          error: false,
          value: '',
          loading: false,
        },
      },
      feedback: '',
    };

    this.timeout = null;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.generateField = this.generateField.bind(this);
  }

  validateAmountField(fieldsObj) {
    const { t } = this.props;
    let feedback = '';
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      let error = false;

      if (/(\.)(.*\1){1}/g.test(value) || /\.$/.test(value)) {
        feedback = t('Invalid amount');
        error = true;
      } else if (
        (field === 'amountFrom' && parseFloat(value) > parseFloat(fieldsObj.amountTo.value))
        || (field === 'amountTo' && parseFloat(value) < parseFloat(fieldsObj.amountFrom.value))
      ) {
        feedback = t('Max amount must be greater than Min amount');
        error = true;
      }

      return {
        ...acc,
        [field]: {
          value,
          error,
          loding: false,
        },
      };
    }, {});

    this.props.updateCustomFilters(fields);
    this.setState({ fields, feedback });
  }

  handleFieldChange({ target }) {
    const { filters } = this.props;
    let value = /^\./.test(target.value) ? `0${target.value}` : target.value;
    value = value.replace(/[^\d.]/g, '');

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    const fields = {
      ...fieldsObj,
      [target.name]: { value, loading: true },
    };

    this.setState({ fields });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateAmountField(fields);
    }, 300);

    this.props.updateCustomFilters(fields);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  generateField(data) {
    const { filters, handleKeyPress } = this.props;
    const { fields } = this.state;

    return (
      <label className={styles.fieldHolder}>
        <InputV2
          autoComplete={'off'}
          onChange={this.handleFieldChange}
          name={data.name}
          value={filters[data.name]}
          placeholder={data.placeholder}
          onKeyDown={handleKeyPress}
          className={`${styles.input} ${fields[data.name].error ? 'error' : ''} ${data.name}Input`}
        />
        <SpinnerV2
          className={`${styles.status} ${fields[data.name].loading && filters[data.name] ? styles.show : ''}`}
        />
        <img
          className={`${styles.status} ${!fields[data.name].loading && filters[data.name] ? styles.show : ''}`}
          src={ fields[data.name].error ? svg.alert_icon : svg.ok_icon}
        />
      </label>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{t('Amount')}</span>
        <div className={styles.fieldRow}>
          { this.generateField({ name: 'amountFrom', placeholder: t('Min') }) }
          <span className={styles.separator} />
          { this.generateField({ name: 'amountTo', placeholder: t('Max') }) }
        </div>
        <Feedback
          className={styles.feedback}
          show={!!this.state.feedback}
          status={this.state.feedback ? 'error' : ''}
          showIcon={false}>
          { this.state.feedback }
        </Feedback>
      </div>
    );
  }
}

export default translate()(AmountFieldGroup);
