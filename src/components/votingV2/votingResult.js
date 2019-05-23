import React from 'react';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import Illustration from '../toolbox/illustration';

const VotingResult = ({
  success, title, message, primaryButon, t,
}) => (
  <div>
    <Illustration name={success ? 'transactionSuccess' : 'transactionError'} />
    <h1>{title}</h1>
    <p>{message}</p>
    <PrimaryButtonV2 onClick={primaryButon.onClick}>
      {primaryButon.title}
    </PrimaryButtonV2>
    {!success ?
      <React.Fragment>
        <p>{t('Does the problem still persist?')}</p>
        <TertiaryButtonV2>
          {t('Report the error via E-Mail')}
        </TertiaryButtonV2>
      </React.Fragment> :
    null}
  </div>
);

export default VotingResult;

