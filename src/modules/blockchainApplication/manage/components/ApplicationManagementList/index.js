import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Footer from 'src/theme/box/footer';
import styles from './applicationManagementList.css';

const ApplicationListItem = ({ key, app }) => (
  <div key={key}>
    {app.name}
  </div>
);

const ApplicationList = ({ apps }) => (
  <div>
    {apps.map((app, index) => <ApplicationListItem app={app} key={`ApplicationListItem-${index}`} />)}
  </div>
);

const ApplicationManagementList = () => {
  const { t } = useTranslation();

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Applications')}</h1>
      </BoxHeader>
      <BoxContent className={styles.chartBox}>
        <ApplicationList apps={[{ name: 'LISK' }, { name: 'Enevti' }, { name: 'DoEdu' }]} />
      </BoxContent>
      <Footer>
        <Link>
          {t('Add application')}
        </Link>
      </Footer>
    </Box>
  );
};

export default ApplicationManagementList;
