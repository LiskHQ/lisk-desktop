import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { validateBookmarkAddress, validateBookmarkLabel, getBookmarkMode } from '@bookmark/utils';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import ModalWrapper from '@bookmark/components/BookmarksListModal/BookmarkModalWrapper';
import Icon from 'src/theme/Icon';
import styles from './AddBookmark.css';
import BookmarkForm from './BookmarkForm';

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
  const [mode, setMode] = useState(getBookmarkMode(history, bookmarks, active));
  const [fields, setFields] = useState([blankField, blankField]);
  const timeout = useRef(null);

  useEffect(() => {
    const { formAddress, label, isValidator } = parseSearchParams(history.location.search);
    const bookmark = bookmarks[active].find((item) => item.address === formAddress);
    const addressFeedback = validateBookmarkAddress(
      active,
      formAddress,
      network,
      bookmarks,
      t,
      false
    );
    const usernameValue = bookmark?.title || label || '';
    const usernameFeedback = validateBookmarkLabel(usernameValue, t);

    setFields([
      {
        value: formAddress || '',
        feedback: addressFeedback,
        readonly: addressFeedback !== '',
      },
      {
        value: usernameValue,
        feedback: usernameFeedback,
        readonly: isValidator === 'true',
      },
    ]);
  }, []);

  useEffect(() => {
    if (account.data?.summary) {
      const username = account.data.pos?.validator?.username ?? '';
      setFields([
        {
          value: account.data.summary.address,
          feedback: '',
          readonly: true,
        },
        {
          value: username,
          feedback: '',
          readonly: username !== '',
        },
      ]);

      setMode(getBookmarkMode(history, bookmarks, active));
    }
  }, [account.data]);

  const onClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    removeSearchParamsFromUrl(history, ['modal', 'formAddress', 'username']);
  };

  const onLabelChange = ({ target: { value } }) => {
    const feedback = validateBookmarkLabel(value, t);
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

    if (!feedback && value !== '') {
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
      wallet: {
        address: fields[0].value,
        title: fields[1].value,
        isValidator: fields[1].readonly,
      },
    });
    onClose();
  };

  const isDisabled = fields.find((field) => field.feedback || field.value === '');

  return (
    <ModalWrapper>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Icon name="bookmarkActive" />
          </header>
          <Box className={styles.box}>
            <BoxHeader>
              <h2>{mode === 'edit' ? t('Edit bookmark') : t('New bookmark')}</h2>
            </BoxHeader>
            <BoxContent>
              <BookmarkForm t={t} status={fields} handlers={[onAddressChange, onLabelChange]} />
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
              <PrimaryButton
                disabled={isDisabled}
                onClick={handleAddBookmark}
                className="save-button"
              >
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
    LSK: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  network: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddBookmark;
