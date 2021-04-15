import React from 'react';
import { withTranslation } from 'react-i18next';
import Illustration from '@toolbox/illustration';
import { PrimaryButton } from '@toolbox/buttons';

const Introduction = ({ t }) => (
  <>
    <Illustration name="reclaimBalanceIntro" />
    <h4>{t('Lisk has now been enhanced even further')}</h4>
    <p>{t('We are proud to announce that Lisk Core v3 now contains new improved robust security features.')}</p>
    <p>
      {t('You can learn more')}
      <span>{t('here')}</span>
    </p>
    <PrimaryButton>{t('Continue')}</PrimaryButton>
  </>
);

export default withTranslation()(Introduction);
