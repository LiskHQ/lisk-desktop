import React from 'react';
import { withTranslation } from 'react-i18next';
import { transactionNames } from '../../../constants/transactionTypes';
import styles from './filters.css';
import Select from '../../toolbox/select';

class DropdownFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      field: {
        error: false,
        value: '',
        loading: false,
      },
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange({ target }) {
    const { valueFormatter, updateCustomFilters, name } = this.props;
    updateCustomFilters({
      [name]: {
        value: valueFormatter(target.value),
        error: '',
        loading: false,
      },
    });
  }

  render() {
    const {
      label, name, filters, t,
    } = this.props;
    const transactionTypes = Object.keys(transactionNames(t))
      .filter((tx, i) => i <= 4)
      .map((key, i) => ({
        value: Number(key),
        label: `${key} - ${transactionNames(t)[i]}`,
      }));

    return (
      <div className={styles.fieldGroup}>
        <span className={styles.fieldLabel}>{label}</span>
        <Select
          options={transactionTypes}
          selected={0}
          onChange={this.onChange}
          className={styles.input}
          size="xs"
        />
      </div>
    );
  }
}

export default withTranslation()(DropdownFilter);
