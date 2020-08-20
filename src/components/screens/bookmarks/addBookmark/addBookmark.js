import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Fields from './fields';
import { validateAddress } from '../../../../utils/validators';
import networks from '../../../../constants/networks';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import styles from './addBookmark.css';
import { getIndexOfBookmark } from '../../../../utils/bookmarks';
import { tokenMap } from '../../../../constants/tokens';
import Icon from '../../../toolbox/icon';
import { selectSearchParamValue, removeSearchParamsFromUrl } from '../../../../utils/searchParams';

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

    const edit = this.isEditing();

    this.state = {
      fields: this.setupFields(),
      showRemoveBtn: edit,
      showSaveBtn: !edit || !this.getUrlSearchParam('isDelegate'),
      edit,
    };

    this.onInputChange = {
      address: this.onAddressChange.bind(this),
      label: this.onLabelChange.bind(this),
    };
    this.handleRemoveBookmark = this.handleRemoveBookmark.bind(this);
    this.handleAddBookmark = this.handleAddBookmark.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  getUrlSearchParam(param) {
    if (param === 'isDelegate') {
      return selectSearchParamValue(this.props.history.location.search, param) === 'true';
    }
    return selectSearchParamValue(this.props.history.location.search, param);
  }

  isEditing() {
    const { token: { active }, bookmarks } = this.props;
    const formAddress = this.getUrlSearchParam('formAddress');
    return bookmarks[active].some(bookmark => bookmark.address === formAddress);
  }

  setupFields() {
    const formAddress = this.getUrlSearchParam('formAddress');
    const label = this.getUrlSearchParam('label');

    return this.fields.reduce((acc, field) => {
      let value = '';
      let readonly = false;
      if (field.name === 'address' && formAddress) {
        value = formAddress;
        readonly = true;
      } else if (field.name === 'label' && label) {
        value = label;
        readonly = this.getUrlSearchParam('isDelegate');
      }

      return {
        ...acc,
        [field.name]: {
          value,
          error: false,
          feedback: field.feedback || '',
          readonly,
        },
      };
    }, {});
  }


  componentDidUpdate(prevProps) {
    const { token } = this.props;
    const { token: prevToken } = prevProps;

    if (this.props.account) this.updateLabelIfDelegate(prevProps, this.props.account);

    if (token.active !== prevToken.active) {
      this.setState(state => ({
        ...state,
        fields: this.setupFields(),
      }));
    }
  }

  updateLabelIfDelegate(prevProps, account) {
    const { fields: { label } } = this.state;
    if (account.data.delegate === prevProps.account.data.delegate) return;

    if (account.data.delegate && account.data.delegate.username !== label.value) {
      const data = { value: account.data.delegate.username, readonly: true };
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
      token: { active }, bookmarkRemoved,
    } = this.props;
    const { fields: { address } } = this.state;

    bookmarkRemoved({
      address: address.value,
      token: active,
    });
    this.onClose();
  }

  handleAddBookmark(e) {
    e.preventDefault();
    const {
      token: { active }, bookmarkAdded, bookmarkUpdated,
    } = this.props;
    const { fields: { label, address } } = this.state;

    const func = this.state.edit ? bookmarkUpdated : bookmarkAdded;

    func({
      token: active,
      account: {
        title: label.value,
        address: address.value,
        isDelegate: this.getUrlSearchParam('isDelegate'),
      },
    });
    this.onClose();
  }

  onClose(e) {
    if (e) e.preventDefault();
    removeSearchParamsFromUrl(this.props.history, ['modal']);
  }

  render() {
    const { t } = this.props;
    const { fields } = this.state;
    const isDisabled = !!Object.keys(fields).find(field => fields[field].error || fields[field].value === '');

    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <header className={styles.header}><Icon name="bookmarkActive" /></header>
          <Box className={styles.box}>
            <BoxHeader><h2>{this.state.edit ? t('Edit bookmark') : t('New bookmark')}</h2></BoxHeader>
            <BoxContent>
              <Fields
                fields={this.fields}
                status={this.state.fields}
                onInputChange={this.onInputChange}
              />
            </BoxContent>
            <BoxFooter direction="horizontal">
              <SecondaryButton className="cancel-button" onClick={this.onClose}>
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

export default withRouter(AddBookmark);
