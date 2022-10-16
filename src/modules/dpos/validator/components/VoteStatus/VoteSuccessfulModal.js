import React, { useCallback, useMemo } from 'react';
import TokenAmount from 'src/modules/token/fungible/components/tokenAmount';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import { PrimaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import styles from './styles.css';

function VoteSuccessfulModal({ history, statusInfo, dposToken }) {
  const { t } = useTranslation();
  const totalLockedBalance = useMemo(() => statusInfo.locked - statusInfo.unlockable, [statusInfo]);

  const handleBackToDelegate = useCallback(() => {
    history.push('/delegates');
  }, []);

  return (
    <Box className={styles.successContainer}>
      <BoxHeader>Voting confirmation</BoxHeader>
      <BoxContent>
        <Illustration className={styles.illustartion} name="votingSuccess" />
        <h4>Vote(s) has been submitted</h4>
        <p>
          <TokenAmount val={Math.abs(totalLockedBalance)} token={dposToken.symbol} />{' '}
          {totalLockedBalance > 0 ? 'will be locked for voting.' : 'will be unlocked.'}
        </p>
      </BoxContent>
      <BoxFooter>
        <PrimaryButton onClick={handleBackToDelegate}>{t('Back to delegates')}</PrimaryButton>
      </BoxFooter>
    </Box>
  );
}

export default withRouter(VoteSuccessfulModal);
