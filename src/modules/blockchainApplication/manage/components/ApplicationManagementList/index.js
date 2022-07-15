import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks/useCurrentApplication';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Footer from 'src/theme/box/footer';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import styles from './applicationManagementList.css';

const ApplicationListItem = ({
  key, app, isCurrentApplication, deleteApp, setApplication,
}) => (
  <div
    key={key}
    onClick={() => {
      setApplication(app.chainId);
    }}
  >
    <div className={styles.appAvatar} />
    {app.name}
    {isCurrentApplication ? (
      <Icon name="checkmark" />
    ) : (
      <TertiaryButton
        onClick={() => { deleteApp(app.chainId); }}
        size="m"
      >
        <Icon name="remove" />
      </TertiaryButton>
    )}
  </div>
);

const ApplicationList = ({ apps }) => {
  const [currentApplication, setApplication] = useCurrentApplication();

  return (
    <div>
      {apps.map((app) => (
        <ApplicationListItem
          key={`ApplicationListItem-${app.chainId}`}
          app={app}
          isCurrentApplication={currentApplication.chainId === app.chainId}
          setApplication={setApplication}
        />
      ))}
    </div>
  );
};

const ApplicationManagementList = () => {
  const { t } = useTranslation();
  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Applications')}</h1>
      </BoxHeader>
      <BoxContent className={styles.chartBox}>
        <ApplicationList apps={[
          { chainId: 1, name: 'LISK' }, { chainId: 2, name: 'Enevti' }, { chainId: 3, name: 'DoEdu' },
        ]}
        />
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
