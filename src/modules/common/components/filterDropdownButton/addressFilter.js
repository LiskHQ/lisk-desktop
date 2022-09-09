import React from 'react';
import { withTranslation } from 'react-i18next';
import { validateAddress, validateLSKPublicKey } from 'src/utils/validators';
import { Input } from 'src/theme';
import styles from './filters.css';

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
    const { t, name } = this.props;
    let feedback = '';

    const fields = Object.keys(fieldsObj).reduce((acc, field) => {
      const value = fieldsObj[field].value || '';
      let error = false;

      if (validateAddress(value) !== 0 && validateLSKPublicKey(value) !== 0 && value !== '') {
        feedback = t('Invalid address or public key');
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
    this.setState({ fields: fields[name], feedback });
  }

  onChange({ target }) {
    const { filters, name } = this.props;

    const fieldsObj = Object.keys(filters).reduce(
      (acc, filter) => ({ ...acc, [filter]: { value: filters[filter] } }),
      {}
    );

    const fields = {
      ...fieldsObj,
      [target.name]: { value: target.value, loading: true },
    };

    this.setState({ fields: fields[name] });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateAmountField(fields);
    }, 300);

    this.props.updateCustomFilters(fields);
  }

  render() {
    const { filters, name, label, placeholder } = this.props;
    const { fields } = this.state;

    return (
      <Input
        onChange={this.onChange}
        label={label}
        placeholder={placeholder}
        value={filters[name]}
        name={name}
        className={`${styles.input} ${fields.error ? 'error' : ''}`}
        isLoading={fields.loading}
        status={fields.error ? 'error' : 'ok'}
        size="m"
        feedback={this.state.feedback}
      />
    );
  }
}

export default withTranslation()(AddressFilter);
