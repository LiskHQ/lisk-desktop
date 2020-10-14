import React from 'react';
import { withTranslation } from 'react-i18next';
import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import BoxHeader from '../../../toolbox/box/header';
import Piwik from '../../../../utils/piwik';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import AccountVisual from '../../../toolbox/accountVisual';
import { tokenMap } from '../../../../constants/tokens';

import styles from './styles.css';

const Members = ({ members, t }) => (
  <div>
    <p>{t('Members')}</p>
    {members.map((member, i) => (
      <div key={`registerMultiSignature-members-list-${i}`}>
        {`${i + 1}.`}
        <AccountVisual address={member.address} />
        {member.name || member.address}
        {member.publicKey}
        {`${member.mandatory}`}
      </div>
    ))}
  </div>
);

const InfoColumn = ({ title, children }) => (
  <div className={styles.infoColumn}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const Summary = ({
  t,
  members = [
    {
      name: 'Wilson Geidt', address: '8195226425328336181L', publicKey: '8155694652104526882', mandatory: true,
    },
    { address: '6195226421328336181L', publicKey: '06549eb906e7e96379f063abreyi32j31bce', mandatory: false },
    { address: '4827364921328336181L', publicKey: '06549eb906e7e96379f063abreyi32j31bce', mandatory: false },
  ],
  fee = 15000000, // rawLSK
  requiredSignatures = 2,
  // account,
  prevStep,
  nextStep,
}) => {
  // const account = useSelector(state => getActiveTokenAccount(state));
  // const dispatch = useDispatch();
  // const network = useSelector(state => state.network);

  const submitTransaction = () => {
    Piwik.trackingEvent('MultiSig_SubmitTransaction', 'button', 'Sign');
    // onst txData = {
    //  nonce: account.nonce,
    //  fee: `${fee}`,
    //  network,
    // };

    // const [error, tx] = await to(
    //   create(txData, transactionTypes().unlockToken.key),
    // );
    const tx = { id: 1 };

    // dispatch({
    //   type: actionTypes.transactionCreatedSuccess,
    //   data: tx,
    // });
    nextStep({ transactionInfo: tx });
  };

  return (
    <section>
      <Box className={styles.container}>
        <BoxHeader className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <Members members={members} t={t} />
          <div className={styles.infoContainer}>
            <InfoColumn title={t('Required Signatures')}>{requiredSignatures}</InfoColumn>
            <InfoColumn title={t('Transaction fee')}>
              <LiskAmount val={fee} token={tokenMap.LSK.key} />
            </InfoColumn>
          </div>
        </BoxContent>
        <BoxFooter className={styles.footer} direction="horizontal">
          <SecondaryButton onClick={prevStep}>Edit</SecondaryButton>
          <PrimaryButton size="l" onClick={submitTransaction}>
            {t('Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default withTranslation()(Summary);
