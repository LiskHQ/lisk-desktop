import React from 'react';
import { translate } from 'react-i18next';

const UnlockWallet = ({ history, handleOnClick }) => (<div>
  UnlockWallet
  <button onClick={() => { handleOnClick(); }} >I have unlocked account</button>
</div>);

export default translate()(UnlockWallet);
