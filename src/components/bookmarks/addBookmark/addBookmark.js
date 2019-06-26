import React from 'react';
import PropTypes from 'prop-types';
import { validateAddress } from '../../../utils/validators';
import networks from '../../../constants/networks';
import Box from '../../boxV2';
import { InputV2 } from '../../toolbox/inputsV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import Feedback from '../../toolbox/feedback/feedback';
import styles from './addBookmark.css';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import { tokenMap } from '../../../constants/tokens';
import routes from '../../../constants/routes';

class AddBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.fields = [{
      name: 'address',
      label: props.t('Address'),
    }, {
      name: 'label',
      label: props.t('Label'),
      feedback: props.t('Max. 20 characters'),
    }];

    const fields = this.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: {
        value: '',
        error: false,
        feedback: field.feedback || '',
        readonly: false,
      },
    }), {});

    this.state = {
      fields,
    };

    this.onInputChange = {
      address: this.onAddressChange.bind(this),
      label: this.onLabelChange.bind(this),
    };
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { token, accounts } = this.props;
    const { token: prevToken } = prevProps;
    const { fields } = this.state;

    const account = accounts[fields.address.value] || {};
    if (account.delegate && account.delegate.username !== fields.label.value) {
      this.updateField({
        name: 'label',
        data: { value: account.delegate.username, readonly: true },
      });
    }

    if (token.active === prevToken.active) {
      return true;
    }
    this.revalidate(token.active);
    return false;
  }

  updateField({ name, data }) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        [name]: {
          ...fields[name],
          ...data,
        },
      },
    }));
  }

  revalidate(token) {
    const { fields: { label, address } } = this.state;
    this.updateField({ name: 'address', data: { ...this.validateAddress(token, address.value) } });
    this.updateField({ name: 'label', data: { ...this.validateLabel(label.value) } });
  }

  onLabelChange({ target: { name, value } }) {
    const { error, feedback } = this.validateLabel(value);
    this.updateField({
      name,
      data: { error, value, feedback },
    });
  }

  validateLabel(value) {
    const { t } = this.props;
    const maxLength = 20;
    const error = value.length > maxLength;
    const feedback = !error
      ? t('Max. 20 characters')
      : t('Nickname is too long.');
    return { feedback, error };
  }

  checkDelegate(value) {
    const { searchAccount } = this.props;
    searchAccount({ address: value });
  }

  onAddressChange({ target: { name, value } }) {
    const { token: { active } } = this.props;
    const { feedback, error } = this.validateAddress(active, value);
    if (active === tokenMap.LSK.key && !error) {
      this.checkDelegate(value);
    }

    this.updateField({
      name,
      data: { error, value, feedback },
    });
  }

  validateAddress(token, value) {
    const { network, bookmarks } = this.props;
    const netCode = network.name === networks.mainnet.name
      ? networks.mainnet.code
      : networks.testnet.code;
    const isInvalid = validateAddress(token, value, netCode) === 1;
    const alreadyBookmarked = !isInvalid
      && getIndexOfBookmark(bookmarks, { address: value, token }) !== -1;
    const feedback =
      (isInvalid && 'Invalid address.')
      || (alreadyBookmarked && 'Address already bookmarked.')
      || '';
    return { error: isInvalid || alreadyBookmarked, feedback };
  }

  handleAddBookmark(e) {
    e.preventDefault();
    const { token: { active }, bookmarkAdded, accounts } = this.props;
    const { fields: { label, address } } = this.state;
    const publicKey = active === tokenMap.LSK.key
      ? accounts[address.value].publicKey
      : null;
    const account = {
      title: label.value,
      address: address.value,
      publicKey,
    };
    bookmarkAdded({ token: active, account });
    this.props.history.push(routes.bookmarks.path);
  }

  render() {
    const { t } = this.props;
    const { fields } = this.state;
    const isDisabled = !!Object.keys(fields).find(field => fields[field].error || fields[field].value === '');

    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <header>
            <h1>{t('Bookmarks')}</h1>
          </header>
          <Box>
            <header>
              <h2>
                {t('New bookmark')}
              </h2>
            </header>
            <div className={styles.formHolder}>
              {this.fields.map(field => (
                <label key={field.name}>
                  <span className={styles.label}>
                    {field.label}
                  </span>
                  <InputV2
                    className={styles.input}
                    value={fields[field.name].value}
                    onChange={this.onInputChange[field.name]}
                    name={field.name}
                    readOnly={field.readonly}
                  />
                  <Feedback
                    className={`${styles.feedback} ${fields[field.name].error ? styles.error : ''}`}
                    show={true}
                    status={fields[field.name].error ? 'error' : ''}
                  >
                    {fields[field.name].feedback}
                  </Feedback>
                </label>
              ))}
              <div className={styles.buttonHolder}>
                <PrimaryButtonV2
                  disabled={isDisabled}
                  onClick={this.handleAddBookmark}
                >
                  {t('Add bookmark')}
                </PrimaryButtonV2>
              </div>
            </div>
          </Box>
        </div>
      </div>
    );
  }
}

AddBookmark.displayName = 'AddBookmark';
AddBookmark.propTypes = {
  t: PropTypes.func.isRequired,
  token: PropTypes.shape({
    active: PropTypes.string.isRequired,
  }).isRequired,
  bookmarks: PropTypes.shape({
    LSK: PropTypes.arrayOf(PropTypes.shape({
      address: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })),
  }).isRequired,
  network: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddBookmark;
