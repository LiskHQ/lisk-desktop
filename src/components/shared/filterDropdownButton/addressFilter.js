import React from 'react';
import { withTranslation } from 'react-i18next';
import styles from './filters.css';
import { Input } from '../../toolbox/inputs';
import { validateAddress } from '../../../utils/validators';
import { tokenMap } from '../../../constants/tokens';
import Feedback from '../../toolbox/feedback/feedback';

class AddressFilter extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        error: false,
        value: '',
        loading: false,
      },
      feedback: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  validateAmountField(fieldsObj) {
    const { t } = this.props;
    let feedback = '';
    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      let error = false;

      if (validateAddress(tokenMap.LSK.key, value) !== 0) {
        feedback = t('Invalid address');
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
    this.setState({ fields, feedback });
  }

  onChange({ target }) {
    const { filters } = this.props;

    const fieldsObj = Object.keys(filters).reduce((acc, filter) =>
      ({ ...acc, [filter]: { value: filters[filter] } }), {});

    const fields = {
      ...fieldsObj,
      [target.name]: { value: target.value, loading: true },
    };

    this.setState({ fields });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateAmountField(fields);
    }, 300);

    this.props.updateCustomFilters(fields);
  }

  render() {
    const {
      filters, name, label, placeholder,
    } = this.props;
    const { fields } = this.state;

    return (
      <div>
        <Input
          onChange={this.onChange}
          label={label}
          placeholder={placeholder}
          value={filters[name]}
          name={name}
          className={`${styles.input} ${fields.error ? 'error' : ''}`}
          isLoading={fields.loading}
          status={fields.error ? 'error' : 'ok'}
          size="xs"
        />
        <Feedback
          className={styles.feedback}
          show={!!this.state.feedback}
          status={this.state.feedback ? 'error' : ''}
          size="xs"
        />
        {this.state.feedback}
      </div>
    );
  }
}

export default withTranslation()(AddressFilter);
