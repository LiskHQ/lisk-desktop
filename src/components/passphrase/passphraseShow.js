import React from 'react';
import Input from '../toolbox/inputs/input';
import ActionBar from '../actionBar';
import PassphraseTheme from './passphraseTheme';

const PassphraseShow = ({ t, passphrase, nextStep, prevStep }) => (
  <div>
    <PassphraseTheme>
      <Input type='text' multiline autoFocus={true}
        className='passphrase'
        label={t('Save your passphrase in a safe place')}
        value={passphrase} />
    </PassphraseTheme>

    <ActionBar
      secondaryButton={{
        label: t('Back'),
        onClick: () => prevStep({ jump: 2 }),
      }}
      primaryButton={{
        label: t('Yes! It\'s safe'),
        className: 'next-button',
        onClick: () => nextStep({ passphrase }),
      }} />
  </div>);


export default PassphraseShow;
