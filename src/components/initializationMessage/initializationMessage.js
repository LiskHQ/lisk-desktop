import React from 'react';
import FlashMessage from '../toolbox/flashMessage/flashMessage';
import FlashMessageHolder from '../toolbox/flashMessage/holder';
import externalLinks from '../../constants/externalLinks';
import routes from '../../constants/routes';

const InitializationMessage = ({
  account,
  history,
  settings,
  t,
  pendingTransactions,
}) => {
  const shouldShowInitialization = (
    !!(account.info
      && !(account.info.LSK.serverPublicKey
      || account.info.LSK.balance === 0
      || pendingTransactions.length > 0
      || settings.token.active === 'BTC')
    )
  );

  const onButtonClick = () => {
    history.push(`${routes.send.path}?recipient=${account.address}&amount=0.1&reference=Account initialization`);
  };

  FlashMessageHolder.addMessage((
    <FlashMessage
      shouldShow={shouldShowInitialization}
    >

      <FlashMessage.Content
        icon="warningIcon"
        link={{
          label: t('Learn more'),
          action: externalLinks.accountInitialization,
        }}
      >
        {t('We advise all users to initialize their account as soon as possible. To do so, simply make one outgoing transaction.')}
      </FlashMessage.Content>

      <FlashMessage.Button
        onClick={onButtonClick}
      >
        {t('Initialize account')}
      </FlashMessage.Button>

    </FlashMessage>
  ), 'InitializationMessage');

  return null;
};

export default InitializationMessage;
