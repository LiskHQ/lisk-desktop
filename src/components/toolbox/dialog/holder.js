import React, {
  useState, useRef, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import styles from './dialog.css';
import { modals } from '../../../constants/routes';
import { parseSearchParams, removeSearchParamFromUrl } from '../../../utils/searchParams';

// eslint-disable-next-line max-statements
const DialogHolder = ({ history }) => {
  const modalName = useMemo(() => {
    const { modal = '' } = parseSearchParams(history.location.search);
    return modals[modal] ? modal : undefined;
  }, [history.location.search]);

  if (!modalName) {
    return null;
  }

  const settings = useSelector(state => state.settings);
  const networkIsSet = useSelector(state => !!state.network.name && !!state.network.serviceUrl);
  const isAuthenticated = useSelector(state =>
    (state.account.info && state.account.info[settings.token.active]));

  if (!networkIsSet || modals[modalName].forbiddenTokens.includes(settings.token.active)) {
    return null;
  }

  if (modals[modalName].isPrivate && !isAuthenticated) {
    return null;
  }

  const backdropRef = useRef();
  const [dismissed, setDismissed] = useState(true);

  const onBackDropClick = (e) => {
    if (e.target === backdropRef.current) {
      removeSearchParamFromUrl(history, 'modal');
    }
  };

  const onAnimationEnd = () => {
    if (dismissed) {
      setDismissed(false);
    }
  };


  const ModalComponent = useMemo(() => {
    if (modalName) {
      setDismissed(false);
      document.body.style.overflow = 'hidden';
      return modals[modalName].component;
    }
    setDismissed(true);
    document.body.style.overflow = '';
    return null;
  }, [modalName]);

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
