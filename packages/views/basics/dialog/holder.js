import React, {
  useState, useRef, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import routesMap from '@src/routesMap';
import { modals } from '@common/configuration';
import { parseSearchParams, removeSearchParamsFromUrl } from '@common/utilities/searchParams';
import styles from './dialog.css';

// eslint-disable-next-line max-statements
const DialogHolder = ({ history }) => {
  const modalName = useMemo(() => {
    const { modal = '' } = parseSearchParams(history.location.search);
    return routesMap[modal] ? modal : undefined;
  }, [history.location.search]);

  const settings = useSelector(state => state.settings);
  const networkIsSet = useSelector(state => !!state.network.name);
  const isAuthenticated = useSelector(state =>
    (state.account.info && state.account.info[settings.token.active]));

  const backdropRef = useRef();
  const [dismissed, setDismissed] = useState(false);

  const ModalComponent = useMemo(() => {
    if (modalName) {
      setDismissed(false);
      document.body.style.overflow = 'hidden';
      return routesMap[modalName];
    }
    setDismissed(true);
    document.body.style.overflow = '';
    return null;
  }, [modalName]);

  if (!modalName) {
    return null;
  }

  if (modals[modalName].forbiddenTokens.includes(settings.token.active)) {
    return null;
  }

  if (!networkIsSet && modals[modalName].isPrivate) {
    return null;
  }

  if (modals[modalName].isPrivate && !isAuthenticated) {
    return null;
  }

  const onBackDropClick = (e) => {
    if (e.target === backdropRef.current) {
      if (modalName !== 'reclaimBalance') {
        removeSearchParamsFromUrl(history, ['modal'], true);
      }
    }
  };

  const onAnimationEnd = () => {
    if (dismissed) {
      setDismissed(false);
    }
  };

  return ModalComponent && (
    <div
      ref={backdropRef}
      className={`${styles.mask} ${dismissed ? styles.hide : styles.show}`}
      onAnimationEnd={onAnimationEnd}
      onClick={onBackDropClick}
    >
      <ModalComponent />
    </div>
  );
};

DialogHolder.displayName = 'DialogHolder';

export default withRouter(DialogHolder);
