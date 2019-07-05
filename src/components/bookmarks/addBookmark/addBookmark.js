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
import AccountVisual from '../../accountVisual';

class AddBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.fields = [{
      name: 'address',
      label: props.t('Address'),
      placeholder: props.t('Insert public address'),
    }, {
      name: 'label',
      label: props.t('Label'),
      feedback: props.t('Max. 20 characters'),
      placeholder: props.t('Insert label'),
    }];

    this.state = {
      fields: this.setupFields(),
    };

    this.onInputChange = {
      address: this.onAddressChange.bind(this),
      label: this.onLabelChange.bind(this),
    };
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
  }

  setupFields() {
    return this.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: {
        value: '',
        error: false,
        feedback: field.feedback || '',
        readonly: false,
      },
    }), {});
  }


  componentDidUpdate(prevProps, prevState) {
    const { token } = this.props;
    const { token: prevToken } = prevProps;
    const { fields: { address } } = prevState;

    this.updateLabelIfDelegate(address.value);

    if (token.active !== prevToken.active) {
      this.setState(state => ({
        ...state,
        fields: this.setupFields(),
      }));
    }
  }

  updateLabelIfDelegate(prevAddress) {
    const { token, accounts } = this.props;
    const { fields: { label, address } } = this.state;
    const account = (token.active === tokenMap.LSK.key && accounts[address.value]) || {};
    if (address.value === prevAddress && account.delegate) return;

    if (account.delegate && account.delegate.username !== label.value) {
      const data = { value: account.delegate.username, readonly: true };
      this.updateField({
        name: 'label',
        data,
      });
    } else if (label.readonly) {
      this.updateField({
        name: 'label',
        data: { value: '', readonly: false },
      });
    }
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

  onLabelChange({ target: { name, value } }) {
    const { error, feedback } = this.validateLabel(value);
    this.updateField({
      name,
      data: {
        error,
        value,
        feedback,
        readonly: false,
      },
    });
  }

  validateLabel(value) {
    const { t } = this.props;
    const maxLength = 20;
    const error = value.length > maxLength;
    const feedback = !error
      ? t('Max. 20 characters')
      : t('Label is too long.');
    return { feedback, error };
  }

  searchAccount(value) {
    const { searchAccount } = this.props;
    searchAccount({ address: value });
  }

  onAddressChange({ target: { name, value } }) {
    const { token: { active } } = this.props;
    const { feedback, error, isInvalid } = this.validateAddress(active, value);
    if (active === tokenMap.LSK.key && !error && value.length) {
      this.searchAccount(value);
    }

    this.updateField({
      name,
      data: {
        error,
        value,
        feedback,
        isInvalid,
      },
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
    return { error: isInvalid || alreadyBookmarked, isInvalid, feedback };
  }

  handleAddBookmark(e) {
    e.preventDefault();
    const {
      token: { active }, bookmarkAdded, accounts, history,
    } = this.props;
    const { fields: { label, address } } = this.state;
    const { publicKey, delegate } = accounts[address.value] || {};
    bookmarkAdded({
      token: active,
      account: {
        title: label.value,
        address: address.value,
        isDelegate: !!(delegate && delegate.username),
        publicKey,
      },
    });
    history.push(routes.bookmarks.path);
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
                  <span className={styles.fieldGroup}>
                    {field.name === 'address'
                      ? (
                        <AccountVisual
                          className={styles.avatar}
                          placeholder={fields[field.name].isInvalid || !fields[field.name].value}
                          address={fields[field.name].value}
                          size={25}
                        />
                      ) : null
                    }
                    <InputV2
                      error={fields[field.name].error}
                      className={styles.input}
                      value={fields[field.name].value}
                      onChange={this.onInputChange[field.name]}
                      name={field.name}
                      placeholder={field.placeholder}
                      readOnly={fields[field.name].readonly}
                      size={'l'}
                      autoComplete="off"
                    />
                    <Feedback
                      className={`${styles.feedback} ${fields[field.name].error ? styles.error : ''}`}
                      status={fields[field.name].error ? 'error' : ''}
                    >
                      {fields[field.name].feedback}
                    </Feedback>
                  </span>
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
