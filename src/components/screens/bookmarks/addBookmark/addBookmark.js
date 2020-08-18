import React from 'react';
import PropTypes from 'prop-types';
import { validateAddress } from '../../../../utils/validators';
import networks from '../../../../constants/networks';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { Input } from '../../../toolbox/inputs';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import styles from './addBookmark.css';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import { tokenMap } from '../../../../constants/tokens';
import AccountVisual from '../../../toolbox/accountVisual';
import Icon from '../../../toolbox/icon';

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
      showRemoveBtn: this.props.edit,
      showSaveBtn: !this.props.edit,
      edit: this.props.edit,
    };

    this.onInputChange = {
      address: this.onAddressChange.bind(this),
      label: this.onLabelChange.bind(this),
    };
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this);
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
    if (this.props.edit) this.props.account.loadData({});
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


  componentDidUpdate(prevProps) {
    const { token } = this.props;
    const { token: prevToken } = prevProps;

    this.updateFields(prevProps, this.props, this.state);

    if (token.active !== prevToken.active) {
      this.setState(state => ({
        ...state,
        fields: this.setupFields(),
      }));
    }
  }

  updateFields(
    prevProps,
    { account, bookmarks, token: { active } },
    { fields, fields: { label } },
  ) {
    if (account.data.address === prevProps.account.data.address) return;

    const bookmark = bookmarks[active].find(mark => mark.address === account.data.address);

    let newFields = {
      ...fields,
      address: { value: account.data.address, readonly: true },
      label: { value: bookmark ? bookmark.title : '', readonly: false },
    };

    if (account.data.delegate !== prevProps.account.data.delegate) {
      if (account.data.delegate && account.data.delegate.username !== label.value) {
        const data = { value: account.data.delegate.username, readonly: true };
        newFields = { ...newFields, label: data };
      } else if (label.readonly) {
        newFields = { ...newFields, label: { value: '', readonly: false } };
      }
    }

    this.setState({
      fields: newFields,
      showRemoveBtn: bookmark,
      showSaveBtn: !account.data.delegate || !bookmark,
      edit: bookmark,
    });
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

  onAddressChange({ target: { name, value } }) {
    const { token: { active }, account } = this.props;
    const { feedback, error, isInvalid } = this.validateAddress(active, value);
    if (active === tokenMap.LSK.key && !error && value.length) {
      account.loadData({ address: value });
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
    const { network, bookmarks, t } = this.props;
    const netCode = network.name === networks.mainnet.name
      ? networks.mainnet.code
      : networks.testnet.code;
    const isInvalid = validateAddress(token, value, netCode) === 1;
    const alreadyBookmarked = !isInvalid
      && getIndexOfBookmark(bookmarks, { address: value, token }) !== -1;
    const feedback = (isInvalid && t('Invalid address'))
      || (alreadyBookmarked && t('Address already bookmarked'))
      || '';
    return { error: isInvalid || alreadyBookmarked, isInvalid, feedback };
  }

  handleRemoveBookmark(e) {
    e.preventDefault();
    const {
      token: { active }, bookmarkRemoved, prevStep,
    } = this.props;
    const { fields: { address } } = this.state;

    bookmarkRemoved({
      address: address.value,
      token: active,
    });
    prevStep({});
  }

  handleAddBookmark(e) {
    e.preventDefault();
    const {
      token: { active }, bookmarkAdded, account, prevStep, bookmarkUpdated,
    } = this.props;
    const { fields: { label, address } } = this.state;
    const { publicKey, delegate } = account.data;

    const func = this.state.edit ? bookmarkUpdated : bookmarkAdded;

    func({
      token: active,
      account: {
        title: label.value,
        address: address.value,
        isDelegate: !!(delegate && delegate.username),
        publicKey,
      },
    });
    prevStep({});
  }

  render() {
    const { t, prevStep } = this.props;
    const { fields } = this.state;
    const isDisabled = !!Object.keys(fields).find(field => fields[field].error || fields[field].value === '');

    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <header className={styles.header}><Icon name="bookmarkActive" /></header>
          <Box className={styles.box}>
            <BoxHeader><h2>{t('New bookmark')}</h2></BoxHeader>
            <BoxContent>
              {this.fields.map(field => (
                <label key={field.name}>
                  <span className={styles.label}>
                    {field.label}
                  </span>
                  <span className={styles.fieldGroup}>
                    <Input
                      error={fields[field.name].error}
                      className={styles.input}
                      value={fields[field.name].value}
                      onChange={this.onInputChange[field.name]}
                      name={field.name}
                      placeholder={field.placeholder}
                      readOnly={fields[field.name].readonly}
                      size="l"
                      autoComplete="off"
                      feedback={fields[field.name].feedback}
                      status={fields[field.name].error ? 'error' : 'ok'}
                    />
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
                  </span>
                </label>
              ))}
            </BoxContent>
            <BoxFooter direction="horizontal">
              <SecondaryButton className="cancel-button" onClick={() => prevStep({})}>
                {t('Cancel')}
              </SecondaryButton>
              {this.state.showRemoveBtn && (
                <SecondaryButton className="remove-button" onClick={this.handleRemoveBookmark}>
                  <div className={styles.removeBtn}>
                    <Icon name="remove" />
                    {t('Remove')}
                  </div>
                </SecondaryButton>
              )}
              {this.state.showSaveBtn && (
                <PrimaryButton disabled={isDisabled} onClick={this.handleAddBookmark} className="save-button">
                  {t('Save')}
                </PrimaryButton>
              )}
            </BoxFooter>
          </Box>
        </div>
      </div>
    );
  }
}

AddBookmark.displayName = 'AddBookmark';
AddBookmark.propTypes = {
  autofill: PropTypes.bool,
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
