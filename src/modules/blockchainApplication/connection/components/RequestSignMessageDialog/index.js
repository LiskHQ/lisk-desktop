import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import { SIGNING_METHODS } from '@libs/wcm/constants/permissions';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useSession } from '@libs/wcm/hooks/useSession';
import styles from './RequestSignMessageDialog.css';

// eslint-disable-next-line max-statements
const RequestSignMessageDialog = () => {
  const { t } = useTranslation();
  const { events } = useEvents();
  const { sessionRequest } = useSession();
  const event = events?.find((e) => e.name === EVENTS.SESSION_REQUEST);
  const { message, address } = event?.meta?.params?.request?.params || {};
  const { peer, requiredNamespaces } = sessionRequest || {};

  const { icons, name, url } = peer?.metadata || {};

  return (
    <Dialog className={styles.RequestSignMessageDialog} hasClose>
      <BlockchainAppDetailsHeader
        headerText={SIGNING_METHODS.SIGN_MESSAGE.title}
        application={{
          data: {
            name,
            projectPage: url?.replace(/\/$/, ''),
            icon: icons?.[0],
          },
        }}
        clipboardCopyItems={requiredNamespaces?.lisk?.chains?.map((chain) => ({
          label: 'Chain ID:',
          value: chain?.replace(/\D+/g, ''),
        }))}
      />
      <p>{t('This request was initiated from another application.')}</p>
      <p>Address: {address}</p>
      <p>Message: {message}</p>
    </Dialog>
  );
};

export default RequestSignMessageDialog;
