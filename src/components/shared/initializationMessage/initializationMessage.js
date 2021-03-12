import React from 'react';
import 'numeral/locales';
import FlashMessage from '../../toolbox/flashMessage/flashMessage';
import FlashMessageHolder from '../../toolbox/flashMessage/holder';
import { formatAmountBasedOnLocale } from 'utils/formattedNumber';
import { addSearchParamsToUrl } from 'utils/searchParams';

export const InitializationMessageRenderer = ({
  account,
  history,
  settings,
  t,
  pendingTransactions,
}) => {
  const shouldShowInitialization = (
    settings.token.active === 'LSK'
    && account.info
    && account.info.LSK
    && !(account.info.LSK.serverPublicKey
      || account.info.LSK.balance === 0
      || pendingTransactions.length > 0)
  );

  const onButtonClick = () => {
    const amount = formatAmountBasedOnLocale({ value: 0.1 });
    addSearchParamsToUrl(history, {
      modal: 'send',
      recipient: account.address,
      amount,
      reference: 'Account initialization',
    });
  };

  return (
    <FlashMessage shouldShow={shouldShowInitialization}>
      <FlashMessage.Content
        icon="warningIcon"
      >
        {t('We advise all users to initialize their account as soon as possible. To do so, simply make one outgoing transaction.')}
      </FlashMessage.Content>

      <FlashMessage.Button
        onClick={onButtonClick}
      >
        {t('Initialize account')}
      </FlashMessage.Button>

    </FlashMessage>
  );
};

const InitializationMessage = (props) => {
  setImmediate(() => {
    FlashMessageHolder.addMessage(<InitializationMessageRenderer {...props} />, 'InitializationMessage');
  });
  return null;
};

export default InitializationMessage;
