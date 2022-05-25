import React, {
  useState, useRef, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import routesMap from '@screens/router/routesMap';
import { modals } from '@screens/router/routes';
import { parseSearchParams, removeSearchParamsFromUrl } from 'src/utils/searchParams';
import { selectActiveToken, selectActiveTokenAccount } from '@common/store';
import styles from './dialog.css';

// eslint-disable-next-line max-statements
const DialogHolder = ({ history }) => {
  const modalName = useMemo(() => {
    const { modal = '' } = parseSearchParams(history.location.search);
    return routesMap[modal] ? modal : undefined;
  }, [history.location.search]);

  const activeToken = useSelector(selectActiveToken);
  const networkIsSet = useSelector(state => !!state.network.name);
  const account = useSelector(selectActiveTokenAccount);

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

  if (modals[modalName].forbiddenTokens.includes(activeToken)) {
    return null;
  }

  if (!networkIsSet && modals[modalName].isPrivate) {
    return null;
  }

  if (modals[modalName].isPrivate && !account.summary) {
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
