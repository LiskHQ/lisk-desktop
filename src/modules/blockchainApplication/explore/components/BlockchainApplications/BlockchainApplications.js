import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';
import TabsContainer from '@theme/tabs/tabsContainer/tabsContainer';
import InfoBanner from '@common/components/infoBanner/infoBanner';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';
import styles from './BlockchainApplications.css';
import banners from './banners';
import SessionManager from '../../../connection/components/SessionManager';

const BlockchainApplications = ({ applications, statistics, applyFilters, filters }) => {
  const { t } = useTranslation();
  const [sliderVisibility, setSliderVisibility] = useState(
    !localStorage.getItem('blockchainApplicationsPageBanner')
  );
  const handleSliderBannerClose = () => setSliderVisibility(!sliderVisibility);

  return (
    <div className={styles.wrapper}>
      {sliderVisibility && (
        <Swiper
          pagination
          navigation
          modules={[Pagination, Navigation]}
          loop
          slidesPerView="auto"
          spaceBetween={20}
          className={styles.bannerSwiper}
        >
          {banners.map((bannerInfo, index) => {
            const { infoMessage, infoDescription, illustrationName, infoLink, infoLinkText } =
              bannerInfo;
            return (
              <SwiperSlide key={index}>
                <InfoBanner
                  t={t}
                  className={styles.bannerWrapper}
                  name="blockchainApplicationsPageBanner"
                  infoLabel={t('New')}
                  infoMessage={infoMessage(t)}
                  infoDescription={infoDescription(t)}
                  illustrationName={illustrationName}
                  handleSliderBannerClose={handleSliderBannerClose}
                  infoLink={infoLink}
                  infoLinkText={infoLinkText}
                  show
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <TabsContainer name="main-tabs" activeTab="blockchainApplications">
            <BlockchainApplicationList
              applyFilters={applyFilters}
              filters={filters}
              applications={applications}
              name={t('Explore applications')}
              id="blockchainApplications"
            />
            <SessionManager name={t('Wallet connections')} id="SessionManager" />
          </TabsContainer>
        </div>
        <div className={styles.sideBar}>
          <BlockchainApplicationStatistics statistics={statistics} />
        </div>
      </div>
    </div>
  );
};

export default BlockchainApplications;
