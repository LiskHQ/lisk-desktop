import React from 'react';
import InfoParagraph from '../../infoParagraph';
import ActionBar from '../../actionBar';

const Info = ({
  t, useCaseNote, securityNote, fee, nextStep, backButtonFn,
}) => (
  <div>
    <InfoParagraph>
      {t('Please click Next, then move around your mouse randomly to generate a random passphrase.')}
      <br />
      <br />
      {t('Note: After registration completes,')} { useCaseNote }
      <br />
      { securityNote } {t('Please keep it safe!')}
    </InfoParagraph>

    <ActionBar
      secondaryButton={{
        label: t('Back'),
        onClick: backButtonFn,
      }}
      primaryButton={{
        label: t('Next'),
        fee,
        className: 'next-button',
        onClick: () => nextStep(),
      }} />
  </div>);


export default Info;
