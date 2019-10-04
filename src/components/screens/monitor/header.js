import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import React from 'react';
import PageHeader from '../../toolbox/pageHeader';
import Tabs from '../../toolbox/tabs';
import routes from '../../../constants/routes';

const Header = ({ t, history }) => {
  const isActive = value => value === history.location.pathname;
  const setActiveTab = ({ value }) => history.push(value);

  return (
    <React.Fragment>
      <PageHeader
        title={t('Monitor')}
        subtitle={t('Track the latest activity on the Lisk blockchain.')}
      />
      <Tabs
        tabs={[{
          value: routes.dashboard.path,
          name: t('Transactions'),
        }, {
          value: routes.blocks.path,
          name: t('Blocks'),
        }]}
        isActive={isActive}
        onClick={setActiveTab}
      />
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(Header));
