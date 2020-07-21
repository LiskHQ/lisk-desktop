import React, {
  useState, useRef, useMemo,
} from 'react';
import { withRouter } from 'react-router';
import styles from './dialog.css';
import { modals } from '../../../constants/routes';
import { parseSearchParams, removeSearchParamFromUrl } from '../../../utils/searchParams';

const DialogHolder = ({ history }) => {
  const modalName = useMemo(() => {
    const { modal = '' } = parseSearchParams(history.location.search);
    return modals[modal] ? modal : undefined;
  }, [history.location.search]);

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

export default withRouter(DialogHolder);
