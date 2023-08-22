// istanbul ignore file
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Skeleton from 'src/modules/common/components/skeleton';
import NoTokenBalance from 'src/modules/token/fungible/components/NoTokenBalanceDialog/NoTokenBalance';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import styles from './TokenCarousel.css';

const NavButton = React.forwardRef(({ isNext, onClick }, ref) => (
  <div
    ref={ref}
    className={`${styles.navButtonWrapper} ${styles[isNext ? 'rightNav' : 'leftNav']}`}
  >
    <TertiaryButton onClick={onClick}>
      <Icon name="arrowLeftTailed" />
    </TertiaryButton>
  </div>
));

// eslint-disable-next-line max-statements
const Carousel = ({ renderItem: RenderItem, data = [], isLoading, error, ...rest }) => {
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const { t } = useTranslation();
  const history = useHistory();

  const [activeIndex, setSwiperIndex] = useState(0);
  const [, setWindowSize] = useState(0);
  const [swiperInstance = {}, setSwiperInstance] = useState(null);

  const isPrevVisible = useMemo(() => activeIndex > 0, [activeIndex]);
  const renderData = useMemo(() => (isLoading ? [...new Array(4).keys()] : data), [data]);

  const onRequestToken = () => {
    addSearchParamsToUrl(history, { modal: 'request' });
  };

  useEffect(() => {
    const onResize = ({ target: { innerWidth, innerHeight } }) => {
      setWindowSize({ innerWidth, innerHeight });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!error && !renderData.length) {
    return <NoTokenBalance onRequestToken={onRequestToken} />;
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>{error?.message || error}</p>
        <TertiaryButton onClick={rest.onRetry}>{t('Retry')}</TertiaryButton>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Swiper
        className={styles.swiperWrapper}
        slidesPerView="auto"
        spaceBetween={20}
        modules={[Navigation]}
        onSlideChange={(ref) => {
          setSwiperInstance(ref);
          setSwiperIndex(ref.activeIndex);
        }}
        onSwiper={(swiperRef) => {
          swiperRef.params.navigation.prevEl = prevRef.current;
          swiperRef.params.navigation.nextEl = nextRef.current;
          swiperRef.navigation.update();
          setSwiperInstance(swiperRef);
        }}
        {...rest}
      >
        {renderData.map((props, index) => (
          <SwiperSlide key={index}>
            {isLoading || data.length === 0 ? (
              <Skeleton className={styles.skeletonLoader} width="240px" height="96px" />
            ) : (
              <RenderItem {...props} />
            )}
          </SwiperSlide>
        ))}

        {isPrevVisible && !isLoading && (
          <NavButton
            ref={prevRef}
            onClick={() => {
              swiperInstance?.slidePrev();
              setSwiperIndex(swiperInstance?.activeIndex);
            }}
          />
        )}
        {!swiperInstance?.isEnd && !isLoading && (
          <NavButton
            isNext
            ref={nextRef}
            onClick={() => {
              swiperInstance?.slideNext();
              setSwiperIndex(swiperInstance?.activeIndex);
            }}
          />
        )}
      </Swiper>
    </div>
  );
};

export default Carousel;
