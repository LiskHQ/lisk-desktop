import React from 'react';
import { withTranslation } from 'react-i18next';
import CopyToClipboard from '@toolbox/copyToClipboard';
import Tooltip from '@toolbox/tooltip/tooltip';
import AccountVisualWithAddress from '@shared/accountVisualWithAddress';

const Reclaim = ({ t }) => (
  <>
    <h4>{t('Update to your new account')}</h4>
    <p>{t('Your tokens and passphrase are safe. We kindly ask you to transfer your balance to the new account.')}</p>
    <section>
      <div>
        <div>
          <h5>{t('Old account')}</h5>
          <AccountVisualWithAddress address="5726759782318848681L" />
          <CopyToClipboard />
          <p>{t('Balance')}: 1000LSK</p>
        </div>
        <div>
          <h5>{t('New account')}</h5>
          <AccountVisualWithAddress address="lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt" />
          <CopyToClipboard />
          <p>{t('Balance')}: 0LSK</p>
        </div>
      </div>
      <div>
        <p>{t('You will be able to:')}</p>
        <ul>
          <li>{t('Use your old passphrase ')}</li>
          <li>{t('Access your old address and transaction history')}</li>
        </ul>
      </div>
    </section>
    <section>
      <h5>{t('All you need to do:')}</h5>
      <ul>
        <li>
          <p>
            {t('Deposit at least 0.01 LSK to your new account')}
            <Tooltip position="right" size="m">
              <p>
                {t('Since you want to reclaim your LSK on the new blockchain, you need to pay the fee from your new account. Hence your LSK in your old account can not be used to pay the fee. Read more')}
              </p>
            </Tooltip>
            <span>
              {t('An initial one-time transfer fee will be deducted from the new account. Please use external services to deposit LSK.')}
            </span>
          </p>
        </li>
        <li>
          <p>
            {t('Send a reclaim transaction')}
            <span>
              {t('Once you have enough tokens on your new account you will be able to send a transaction.')}
            </span>
          </p>
        </li>
      </ul>
    </section>
  </>
);

export default withTranslation()(Reclaim);
