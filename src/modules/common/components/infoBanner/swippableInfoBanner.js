import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './infoBanner.css';
import InfoBanner from './infoBanner';

function SwippableInfoBanner({ banners, className }) {
  const [sliderVisibility, setSliderVisibility] = useState(
    !localStorage.getItem('walletPageBanner')
  );
  const handleSliderBannerClose = () => setSliderVisibility(!sliderVisibility);
  const { t } = useTranslation();

  return (
    sliderVisibility && (
      <Swiper
        loop
        navigation
        pagination={{ clickable: true }}
        modules={[Pagination, Navigation]}
        slidesPerView="auto"
        spaceBetween={20}
        className={classNames(styles.bannerSwiper, className)}
      >
        {banners.map((bannerInfo, index) => {
          const { infoMessage, infoDescription, illustrationName, infoLink, infoLinkText, infoLabel } =
            bannerInfo;

          return (
            <SwiperSlide key={index}>
              <InfoBanner
                t={t}
                name="walletPageBanner"
                className={styles.bannerWrapper}
                infoLabel={infoLabel?.(t) || t('New')}
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
    )
  );
}

export default SwippableInfoBanner;
