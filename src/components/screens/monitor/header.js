import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import React from 'react';
import PageHeader from '../../toolbox/pageHeader';
import Switcher from '../../toolbox/switcher';
import routes from '../../../constants/routes';

const Header = ({ t, history }) => {
  const setActiveTab = ({ value }) => history.push(value);

  return (
    <React.Fragment>
      <PageHeader
        title={t('Monitor')}
        subtitle={t('Track the latest activity on the Lisk blockchain.')}
      />
      <Switcher
        options={[{
          value: routes.dashboard.path,
          name: t('Transactions'),
        }, {
          value: routes.blocks.path,
          name: t('Blocks'),
        }]}
        active={history.location.pathname}
        onClick={setActiveTab}
      />
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(Header));
