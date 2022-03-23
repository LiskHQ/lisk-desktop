import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { tokenMap } from '@token/configuration/tokens';
import { validateAddress } from '@common/utilities/validators';
import { getIndexOfBookmark } from '@bookmark/utilities/bookmarks';
import { parseSearchParams, removeSearchParamsFromUrl } from '@screens/router/searchParams';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import BoxFooter from '@basics/box/footer';
import { PrimaryButton, SecondaryButton } from '@basics/buttons';
import Icon from '@basics/icon';
import styles from './addBookmark.css';
import ModalWrapper from '../modalWrapper';
import Fields from './fields';

/**
 *  Checks the label and returns feedback
 *
 * @param {String} value - The label string to check
 * @param {Function} t - i18n function
 * @returns {String} - Feedback string. Empty string if the label is valid
 */
const validateLabel = (value = '', t) => {
  if (value.length > 20) {
    return t('Label is too long, Max. 20 characters');
  }
  return '';
};

/**
 * Checks the address and returns feedback
 *
 * @param {String} token - LSK or BTC
 * @param {String} value - Address string
 * @param {Object} network - The network object from Redux store
 * @param {Object} bookmarks - Lisk of bookmarks from Redux store
 * @param {Function} t - i18n function
 * @param {Boolean} isUnique - Should check if the account is already a bookmark
 * @returns {String} - Feedback string. Empty string if the address is valid (and unique)
 */
const validateBookmarkAddress = (token, value = '', network, bookmarks, t, isUnique) => {
  if (validateAddress(token, value, network) === 1) {
    return t('Invalid address');
  }
  if (isUnique && getIndexOfBookmark(bookmarks, { address: value, token }) !== -1) {
    return t('Address already bookmarked');
  }
  return '';
};

/**
 * Define edit/add mode
 *
 * @param {Object} history - History object from withRouter
 * @param {Object} bookmarks - Lisk of bookmarks from Redux store
 * @param {String} active - LSK, BTC, etc
 * @returns {String} - edit or add
 */
const getMode = (history, bookmarks, active) => {
  const { address } = parseSearchParams(history.location.search);
  return bookmarks[active].some(bookmark => bookmark.address === address) ? 'edit' : 'add';
};

const blankField = { value: '', readonly: false, feedback: '' };

// eslint-disable-next-line max-statements
const AddBookmark = ({
  token: { active },
  account,
  bookmarks,
  history,
  bookmarkRemoved,
  bookmarkAdded,
  bookmarkUpdated,
  network,
  t,
}) => {
  const [mode, setMode] = useState(getMode(history, bookmarks, active));
  const [fields, setFields] = useState([blankField, blankField]);
  const timeout = useRef(null);

  useEffect(() => {
    const { formAddress, label, isDelegate } = parseSearchParams(history.location.search);
    const bookmark = bookmarks[active].find(item => item.address === formAddress);
    const addressFeedback = validateBookmarkAddress(
      active, formAddress, network, bookmarks, t, false,
    );
    const usernameValue = bookmark?.title || label || '';
    const usernameFeedback = validateLabel(usernameValue, t);

    setFields([
      {
        value: formAddress || '',
        feedback: addressFeedback,
        readonly: addressFeedback !== '',
      },
      {
        value: usernameValue,
        feedback: usernameFeedback,
        readonly: isDelegate === 'true',
      },
    ]);
  }, []);

  useEffect(() => {
    if (account.data?.summary) {
      const username = account.data.dpos?.delegate?.username ?? '';
      setFields(
        [{
          value: account.data.summary.address,
          feedback: '',
          readonly: true,
        },
        {
          value: username,
          feedback: '',
          readonly: username !== '',
        }],
      );

      setMode(getMode(history, bookmarks, active));
    }
  }, [account.data]);

  const onClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    removeSearchParamsFromUrl(history, ['modal', 'formAddress', 'username']);
  };

  const onLabelChange = ({ target: { value } }) => {
    const feedback = validateLabel(value, t);
    setFields([
      fields[0],
      {
        value,
        feedback,
        readonly: false,
      },
    ]);
  };

  const onAddressChange = ({ target: { value } }) => {
    const feedback = validateBookmarkAddress(active, value, network, bookmarks, t, true);
    clearTimeout(timeout.current);

    if (active === tokenMap.LSK.key && !feedback && value !== '') {
      timeout.current = setTimeout(() => {
        account.loadData({ address: value });
      }, 300);
    }

    setFields([
      {
        value,
        feedback,
        readonly: false,
      },
      fields[1],
    ]);
  };

  const handleRemoveBookmark = (e) => {
    e.preventDefault();
    bookmarkRemoved({
      address: fields[0].value,
      token: active,
    });
    onClose();
  };

  const handleAddBookmark = (e) => {
    e.preventDefault();

    const func = mode === 'edit' ? bookmarkUpdated : bookmarkAdded;

    func({
      token: active,
      account: {
        address: fields[0].value,
        title: fields[1].value,
        isDelegate: fields[1].readonly,
      },
    });
    onClose();
  };

  const isDisabled = fields.find(field => field.feedback || field.value === '');

  return (
    <ModalWrapper>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <header className={styles.header}><Icon name="bookmarkActive" /></header>
          <Box className={styles.box}>
            <BoxHeader><h2>{mode === 'edit' ? t('Edit bookmark') : t('New bookmark')}</h2></BoxHeader>
            <BoxContent>
              <Fields
                t={t}
                status={fields}
                handlers={[onAddressChange, onLabelChange]}
              />
            </BoxContent>
            <BoxFooter direction="horizontal">
              <SecondaryButton className="cancel-button" onClick={onClose}>
                {t('Cancel')}
              </SecondaryButton>
              {mode === 'edit' && (
                <SecondaryButton className="remove-button" onClick={handleRemoveBookmark}>
                  <div className={styles.removeBtn}>
                    <Icon name="remove" />
                    {t('Remove')}
                  </div>
                </SecondaryButton>
              )}
              <PrimaryButton disabled={isDisabled} onClick={handleAddBookmark} className="save-button">
                {t('Save')}
              </PrimaryButton>
            </BoxFooter>
          </Box>
        </div>
      </div>
    </ModalWrapper>
  );
};

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
