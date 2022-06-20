import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { selectSearchParamValue } from 'src/utils/searchParams';
import { selectActiveTokenAccount, selectNetwork } from 'src/redux/selectors';
import routes from 'src/routes/routes';
import { extractAddressFromPublicKey } from '@wallet/utils/account';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxInfoText from 'src/theme/box/infoText';
import Dialog from 'src/theme/dialog/dialog';
import Tooltip from 'src/theme/Tooltip';
import Members from '../multisignatureMembers';

import styles from './styles.css';

const emptyKeys = {
  numberOfSignatures: 1,
  optionalKeys: [],
  mandatoryKeys: [],
};

const MultisigAccountDetails = ({ t, wallet, history }) => {
  const hostAccount = useSelector(selectActiveTokenAccount);
  const network = useSelector(selectNetwork);
  const isHost = history.location.pathname === routes.wallet.path;
  const data = isHost ? hostAccount : wallet.data;
  const { numberOfSignatures, optionalKeys, mandatoryKeys } = data.keys || emptyKeys;

  const members = useMemo(
    () =>
      optionalKeys
        .map((publicKey) => ({
          address: extractAddressFromPublicKey(publicKey),
          publicKey,
          mandatory: false,
        }))
        .concat(
          mandatoryKeys.map((publicKey) => ({
            address: extractAddressFromPublicKey(publicKey),
            publicKey,
            mandatory: true,
          })),
        ),
    [numberOfSignatures, optionalKeys, mandatoryKeys],
  );

  useEffect(() => {
    if (!isHost) {
      const address = selectSearchParamValue(
        history.location.search,
        'address',
      );
      wallet.loadData({ address });
    }
  }, [network]);

  return (
    <Dialog
      hasClose
      className={`${grid.row} ${grid['center-xs']} ${styles.container}`}
    >
      <Box isLoading={false} className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Multisignature account details')}</h1>
        </BoxHeader>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText>
            <span>
              {t(
                'This is a multisignature account that is controlled by a group of accounts.',
              )}
            </span>
            <span>
              <br />
            </span>
            <span>
              {t(
                'This account requires {{numberOfSignatures}} signatures to create a valid transaction.',
                { numberOfSignatures },
              )}
            </span>
          </BoxInfoText>
          <Members members={members} t={t} />
          <div className={styles.infoContainer}>
            <div className={styles.numberOfSignatures}>
              {t('Required signatures')}
              <Tooltip position="top right" indent>
                <span>
                  {t(
                    'To provide a required signature, use the "Sign multisignature" tool in the sidebar."',
                  )}
                </span>
              </Tooltip>
            </div>
            <span>{numberOfSignatures}</span>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default MultisigAccountDetails;
