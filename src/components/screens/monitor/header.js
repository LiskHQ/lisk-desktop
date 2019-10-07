import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import React from 'react';
import PageHeader from '../../toolbox/pageHeader';
import Switcher from '../../toolbox/switcher';
import routes from '../../../constants/routes';

export const Header = ({ t, history }) => {
  const setActiveTab = ({ target }) => history.push(target.dataset.value);

  return (
    <React.Fragment>
      <PageHeader
        title={t('Monitor')}
        subtitle={t('Track the latest activity on the Lisk blockchain.')}
      />
      <Switcher
        options={[{
          value: routes.dashboard.path, // TODO change to monitorTransactions when available
          name: t('Transactions'),
          className: 'transactions',
        }, {
          value: routes.blocks.path,
          name: t('Blocks'),
          className: 'blocks',
        }]}
        active={history.location.pathname}
        onClick={setActiveTab}
      />
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(Header));
