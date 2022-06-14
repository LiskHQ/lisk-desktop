import React, { useRef, useCallback } from 'react';
import { withRouter } from 'react-router';

import RemoveConfirmation from '@account/components/RemoveConfirmation/RemoveConfirmation';
import RemoveSuccess from '@account/components/RemoveSuccess/RemoveSuccess';
import routes from '@screens/router/routes';
import MultiStep from 'src/modules/common/components/MultiStep';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { useCurrentAccount, useAccounts } from '../../hooks';
import styles from './RemoveAccount.css';

const RemoveAccount = ({ history }) => {
  const [deleteAccountByAddress] = useAccounts();
  const [account] = useCurrentAccount();
  const multiStepRef = useRef(null);

  const removeAccount = useCallback(
    (acc) => acc?.metadata?.address && deleteAccountByAddress(acc?.metadata?.address),
    [deleteAccountByAddress],
  );

  const onRemoveAccount = () => {
    removeAccount();
    multiStepRef.current.next();
  };

  const onComplete = () => {
    history.push(routes.manageAccounts.path);
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          ref={multiStepRef}
        >
          <RemoveConfirmation account={account} onRemoveAccount={onRemoveAccount} />
          <RemoveSuccess onComplete={onComplete} />
        </MultiStep>
      </BoxContent>
    </Box>
  );
};

export default withRouter(RemoveAccount);
