import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import routesMap from 'src/routes/routesMap';
import { modals } from 'src/routes/routes';
import { useCurrentAccount } from '@account/hooks';
import {
  addSearchParamsToUrl,
  parseSearchParams,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { selectActiveToken } from 'src/redux/selectors';
import { useSession } from '@libs/wcm/hooks/useSession';
import { ACTIONS, EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import useSettings from '@settings/hooks/useSettings';
import styles from './dialog.css';

// eslint-disable-next-line max-statements
const DialogHolder = ({ history }) => {
  const modalName = useMemo(() => {
    const { modal = '' } = parseSearchParams(history.location.search);
    return routesMap[modal] ? modal : undefined;
  }, [history.location.search]);
  const [currentAccount] = useCurrentAccount();
  const isAuthenticated = Object.keys(currentAccount).length > 0;
  const activeToken = useSelector(selectActiveToken);
  const { reject } = useSession();
  const { events } = useEvents();
  const { mainChainNetwork } = useSettings('mainChainNetwork');

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

  if (!mainChainNetwork.isAvailable && modals[modalName].isPrivate) {
    return null;
  }

  if (modals[modalName].isPrivate && !isAuthenticated) {
    return null;
  }

  const onBackDropClick = async (e) => {
    if (e.target === backdropRef.current) {
      if (modalName !== 'reclaimBalance') {
        removeSearchParamsFromUrl(history, ['modal'], true);
      }
      if (modalName === 'connectionSummary') {
        const proposalEvents = events.find((ev) => ev.name === EVENTS.SESSION_PROPOSAL);

        const result = await reject(proposalEvents);
        addSearchParamsToUrl(history, {
          modal: 'connectionSuccess',
          action: ACTIONS.REJECT,
          status: result.status,
          name: result.data?.params?.proposer.metadata.name ?? '',
        });
      }
    }
  };

  const onAnimationEnd = () => {
    if (dismissed) {
      setDismissed(false);
    }
  };

  return (
    ModalComponent && (
      <div
        ref={backdropRef}
        className={`${styles.mask} ${dismissed ? styles.hide : styles.show}`}
        onAnimationEnd={onAnimationEnd}
        onMouseDown={onBackDropClick}
      >
        <ModalComponent />
      </div>
    )
  );
};

DialogHolder.displayName = 'DialogHolder';

export default withRouter(DialogHolder);
