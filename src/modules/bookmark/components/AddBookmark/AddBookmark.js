import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { validateBookmarkAddress, validateBookmarkLabel } from '@bookmark/utils';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import BoxFooter from '@theme/box/footer';
import { PrimaryButton, SecondaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import ModalWrapper from '@bookmark/components/BookmarksListModal/BookmarkModalWrapper';
import { useAuth } from '@auth/hooks/queries';
import styles from './AddBookmark.css';
import BookmarkForm from './BookmarkForm';

const blankField = { value: '', readonly: false, feedback: '' };

// eslint-disable-next-line max-statements
const AddBookmark = ({ token: { active }, bookmarks, bookmarkAdded, network }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [fields, setFields] = useState([blankField, blankField]);
  const timeout = useRef(null);
  const { formAddress, label, isValidator } = parseSearchParams(history.location.search);
  const address = formAddress ?? '';
  const [params, setParams] = useState({ address });
  const { data: { meta: authMeta } = {} } = useAuth({
    config: { params },
    options: { enabled: !!params.address },
  });

  useEffect(() => {
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
    if (authMeta) {
      const username = authMeta?.name ?? '';
      setFields([
        {
          value: authMeta.address,
          feedback: '',
          readonly: true,
        },
        {
          value: username,
          feedback: '',
          readonly: username !== '',
        },
      ]);
    }
  }, [authMeta]);

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
        setParams({ address: value });
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

  const handleAddBookmark = (e) => {
    e.preventDefault();
    const [accountAddress, title] = fields;

    const existingBookmark = bookmarks[active].find((item) => item.title === fields[1].value);
    if (existingBookmark) {
      toast.error(`Bookmark with name "${title.value}" already exists`);
      return;
    }

    bookmarkAdded({
      token: active,
      wallet: {
        address: accountAddress.value,
        title: title.value,
        isValidator: title.readonly,
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
              <h2>{t('New bookmark')}</h2>
            </BoxHeader>
            <BoxContent>
              <BookmarkForm t={t} status={fields} handlers={[onAddressChange, onLabelChange]} />
            </BoxContent>
            <BoxFooter direction="horizontal">
              <SecondaryButton className="cancel-button" onClick={onClose}>
                {t('Cancel')}
              </SecondaryButton>
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
