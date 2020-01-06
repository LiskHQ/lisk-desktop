import React from 'react';
import ConfirmMessage from './confirmMessage';
import MultiStep from '../../shared/multiStep';
import PageLayout from '../../toolbox/pageLayout';
import SignMessageInput from './signMessageInput';

const SignMessage = ({ account, t, history }) => (
  <PageLayout width="medium" verticalAlign="middle">
    <MultiStep>
      <SignMessageInput t={t} history={history} />
      <ConfirmMessage t={t} account={account} />
    </MultiStep>
  </PageLayout>
);

export default SignMessage;
