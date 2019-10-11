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

  onChange({ target }) {
    const { filters, t } = this.props;
    const fields = {
      ...filters,
      value: target.value,
      error: false,
    };
    let feedback = '';

    if (validateAddress(tokenMap.LSK.key, target.value) !== 0) {
      fields.error = true;
      feedback = t('Invalid address');
    }

    this.setState({ fields, feedback });

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
