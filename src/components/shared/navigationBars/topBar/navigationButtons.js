import React, { useEffect, useState } from 'react';
import { routes } from '@constants';
import Icon from '@toolbox/icon';
import styles from './navigationButtons.css';

const NavigationButtons = ({ history }) => {
  const [pageIndex, setPageIndex] = useState(history.length);
  const [refIndex, setRefIndex] = useState(history.length);

  const resetNavigation = () => {
    setPageIndex(history.length);
    setRefIndex(history.length);
  };

  const goBack = () => {
    setPageIndex(pageIndex - 1);
    history.goBack();
  };

  const goForward = () => {
    setPageIndex(pageIndex + 1);
    history.goForward();
  };

  useEffect(() => {
    if (history.action === 'PUSH') {
      setPageIndex(pageIndex + 1);
    }

    if (history.location.pathname === routes.login.path) {
      resetNavigation();
    }
  }, [history.location]);

  return (
    <div className={`${styles.wrapper} navigation-buttons`}>
      <button
        className="go-back"
        disabled={pageIndex <= refIndex || history.location.pathname === routes.reclaim.path}
        onClick={goBack}
      >
        <Icon name="arrowLeftActive" />
      </button>
      <button
        className="go-forward"
        disabled={pageIndex >= history.length
          || history.location.pathname === routes.reclaim.path}
        onClick={goForward}
      >
        <Icon name="arrowRightActive" />
      </button>
    </div>
  );
};

export default NavigationButtons;
